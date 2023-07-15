
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import {useHttp} from "../../hooks/http.hook";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {heroesFilter} from "../../actions";

const HeroesFilters = () => {

    const [filter, setFilter] = useState([])
    const {request} = useHttp()
    const dispatch = useDispatch()

    useEffect(() => {
        request('http://localhost:3001/filters')
            .then(res => setFilter(res))

    // eslint-disable-next-line
    }, [])

    const getFilter = (e) => {
        let target = e.target.parentNode.childNodes
        target.forEach((item,i) => {
            if(item.textContent === e.target.textContent){
                filter.forEach((name,j) => {

                    if(i === j) {
                        // console.log(name)
                        dispatch(heroesFilter(name))
                    }
                })
            }
        })
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group" onClick={getFilter}>
                    <button className="btn btn-outline-dark active">Все</button>
                    <button className="btn btn-danger">Огонь</button>
                    <button className="btn btn-primary">Вода</button>
                    <button className="btn btn-success">Ветер</button>
                    <button className="btn btn-secondary">Земля</button>
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;