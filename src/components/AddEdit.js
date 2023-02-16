import { PlusOutlined } from "@ant-design/icons";
import { useState, useReducer } from "react";
import moment from 'moment';
import { Modal, Form, Tag, Select, Input, Button, message, DatePicker } from 'antd';
// import { useGlobelContext } from './context'
import { useGlobelContext } from "../context";



const { TextArea } = Input;
const dateFormat = 'YYYY/DD/MM';


const InputModal = () => {


    const { state, setState, visible, showModal, setVisible, tags, setTags, handleClose } = useGlobelContext();







    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");



    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue("");
    };

    const createTaskObj = (values) => {

        const { title, description, startDate, dueDate, status } = values;

        const startDateValue = new Date(startDate);
        const newStartDate = startDateValue.toDateString();
        const startTime = startDateValue.toLocaleTimeString();

        const dueDateValue = new Date(dueDate);
        const newDueDate = dueDateValue.toDateString();
        const dueTime = dueDateValue.toLocaleTimeString();


        const newTaskObj = {
            id: (new Date()).getTime(),

            title: title,
            description: description,
            timeStamp: newStartDate,
            taskStartTime: startTime,
            dueDate: newDueDate,
            taskDueTime: dueTime,
            status: status,
            tags: tags,
        }

        // const taskTags = tags;

        setState([...state, newTaskObj])

    }






    const [form] = Form.useForm();
    // const [visible, setVisible] = useState(false);

    // const showModal = () => {
    //     setVisible(true);
    // };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            createTaskObj(values)
            message.success('Task Added');
            setVisible(false);
            setTags([])
            form.resetFields()
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        console.log('run');
        setVisible(false);
        form.resetFields();
        // setEdit(false)
        // editTask(null)
    };

    const disabledDate = current => {
        const startDateValue = form.getFieldValue('startDate');
        // console.log(startDateValue);

        return current && current < startDateValue;
    };




    return (
        <>
            {/* <Button type="primary" onClick={showModal}>
                <PlusOutlined />
                Open
            </Button> */}
            <Modal
                title="Add Task"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add Task"
                cancelText="Cancel"
            >
                <Form form={form} initialValues={
                    {
                        'startDate': moment(),
                        'status': 'OPEN',

                    }

                }>
                    <Form.Item
                        name="title"
                        label="Add Title"
                        rules={[

                            {
                                required: true,
                                message: 'Please enter a title for the task'
                            },
                            {
                                max: 100,
                                message: "100 characters"
                            }

                        ]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Add Description"
                        rules={[
                            {
                                required: true,
                                message: "Please Add a Description for the task"
                            },
                            {
                                max: 1000,
                                message: "maxWords-1000"
                            }
                        ]}
                    >
                        <TextArea placeholder="maxLength-1000" rows={4}></TextArea>
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Start-date"
                    >
                        <DatePicker disabled format={dateFormat} />
                    </Form.Item>
                    <Form.Item
                        name="dueDate"
                        label="Due-date"
                    >
                        <DatePicker disabledDate={disabledDate} format={dateFormat} />
                    </Form.Item>
                    <Form.Item name="tags" label="Tags">
                        {tags.map((tag, index) => {
                            return (
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => handleClose(tag)}
                                >
                                    {tag}
                                </Tag>
                            );
                        })}
                        {inputVisible && (
                            <Input
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={handleInputChange}
                                onBlur={handleInputConfirm}
                                onPressEnter={handleInputConfirm}
                                onFocus={true}
                            />
                        )}
                        {!inputVisible && (
                            <Tag onClick={showInput} style={{ background: "#fff", borderStyle: "dashed", hover: "#fff" }}>
                                <a>Add tag</a>
                            </Tag>
                        )}
                    </Form.Item>

                    <Form.Item name="status" label="Status"

                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Select value="open" defaultValue="open" >
                            <Select.Option value="open" label="OPEN" >OPEN</Select.Option>
                            <Select.Option value="working" label="WORKING" >WORKING</Select.Option>
                            <Select.Option value="done" label="DONE" >DONE</Select.Option>
                            <Select.Option value="overdue" label="OVERDUE" >OVERDUE</Select.Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};

export default InputModal