import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect'

import {heroDeleted, fetchHeroes, heroesFetching, heroesFetched, heroesFetchingError} from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroesSelector = createSelector(
        (state) => state.filters.filters,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
                console.log('render');
            if (filter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    )

    const filteredHeroes = useSelector(filteredHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

            // console.log(filteredHeroes)
    useEffect(() => {
        // dispatch(fetchHeroes(request))

            dispatch(heroesFetching());
            request("http://localhost:3001/heroes")
                .then(data => dispatch(heroesFetched(data)))
                .catch(() => dispatch(heroesFetchingError()))


        // eslint-disable-next-line
    }, []);
    const getHeroToDelete = (id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(() => dispatch(heroDeleted(id)))
    }

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        // console.log(arr)
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }


        return (
            <TransitionGroup>
                { arr.map(({id, nodeRef, ...props}) => (
                        <CSSTransition
                            key={id}
                            nodeRef={nodeRef}
                            timeout={500}
                            classNames="item-list"
                        >
                            <HeroesListItem key={id} {...props} nodeRef={nodeRef} toDelete={() => getHeroToDelete(id)}/>
                        </CSSTransition>
                    )
                )}
            </TransitionGroup>
        )

}
    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
                {elements}

        </ul>
    )
}

export default HeroesList;