

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров


import {createRef, useEffect, useState} from "react";
import {v4 as uuid} from "uuid";
import {useDispatch} from "react-redux";
import {heroesCreated} from "../../actions";
import {useHttp} from "../../hooks/http.hook";
const HeroesAddForm = () => {

    const [element, setElement] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [options, setOptions] = useState([])
    const id = uuid()
    const ruOptions = ["Я владею элементом...","Огонь","Вода","Ветер","Земля"]

    const dispatch = useDispatch()
    const {request}= useHttp()

    useEffect(() => {
        request("http://localhost:3001/filters")
            .then(res => setOptions(res))
// eslint-disable-next-line
    }, [])

    const getOptions = () => {
        return (
            options.map((item,i) => {
                return(
                    <option value={item} key={i}>
                    {
                        ruOptions.map((item,j) => {
                            if(i === j){
                                return item
                            }
                        })
                    }
                    </option>
                )
            })
        )
    }
    const newHero = (e) => {
        e.preventDefault()
        const hero = {
            id,
            name,
            description,
            element,
            // чтобы не ругался Transition group, как в документации сделал
            nodeRef: createRef()
        }

        request("http://localhost:3001/heroes", 'POST', JSON.stringify(hero) )
            .then(() => dispatch(heroesCreated(hero)))


        setDescription('')
        setName('')
        setElement('')
    }

    return (

        <form className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={name}
                    onChange={(event) => setName(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={element}
                    onChange={(e) => {
                        setElement(e.target.value)
                    }}>
                    {getOptions()}
                </select>
            </div>

            <button type="submit" className="btn btn-primary" onClick={newHero}>Создать</button>
        </form>
    )
}

export default HeroesAddForm;