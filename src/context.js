import React, { useEffect } from "react";
import moment from 'moment';
import { useState, useContext, createContext } from "react";
import { data } from "./data";
const AppContext = createContext();

const AppProvider = ({ children }) => {

    const [state, setState] = useState(data);
    const [visible, setVisible] = useState(false);
    // const [edit, setEdit] = useState(false);
    // const [editTask, setEditTask] = useState(null);
    const [tags, setTags] = useState([]);





    // const handleEdit = (id) => {



    //     let task = data.find((task) => task.id === id);

    //     // console.log(task);

    //     setEditTask(task);
    //     setEdit(true);
    //     // console.log(editTask);
    //     // showModal();

    // }

    // useEffect(() => {
    //     // let task = data.find((task) => task.id === id);

    //     // console.log(task);

    //     // setEditTask(task);

    //     if (editTask) {

    //         showModal();
    //     }


    // }, [editTask])

    const showModal = () => {
        setVisible(true);
    };
    // const handleCancel = () => {
    //     console.log('run');
    //     setVisible(false);
    // };

    const handleClose = removedTag => {
        console.log('hhh');
        setTags(tags.filter(tag => tag !== removedTag));
    };

    return <AppContext.Provider value={{ state, setState, visible, showModal, setVisible, tags, setTags, handleClose }} >{children}</AppContext.Provider>
}


const useGlobelContext = () => {

    return useContext(AppContext);

}

export default AppProvider;

export { useGlobelContext }