import React, { useState, useRef } from 'react'
import { data } from '../data'
import { Button, Form, InputNumber, Typography, Space, Input, Tag, ConfigProvider, Popconfirm, DatePicker, Select } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import { PlusOutlined } from "@ant-design/icons"
import enUS from "antd/locale/en_US";
import moment from 'moment'
import { useGlobelContext } from '../context'
import InputModal from './AddEdit'
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Replace 'en' with the appropriate locale for your app
dayjs.locale('en');
const dateFormat = 'YYYY/DD/MM';

const { TextArea } = Input;

const Table = () => {

    const actionRef = useRef(null)

    const [searchParams, setSearchParams] = useState({})

    const { state, setState, showModal, } = useGlobelContext()


    const columns = [
        {
            title: "Timestamp",
            dataIndex: "timeStamp",
            key: "timeStamp",
            valueType: "date",
            editable: true,
            sorter: (a, b) => new Date(a.timeStamp) - new Date(b.timeStamp),
            search: false,
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            search: false,
            editable: true,
            sorter: (a, b) => a.title.charAt(0) - b.title.charAt(0),

        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            search: false,
            editable: true,
            sorter: (a, b) => a.description.charAt(0) - b.description.charAt(0),
        },
        {
            title: "Duedate",
            dataIndex: "dueDate",
            key: "dueDate",
            valueType: "date",
            editable: true,
            sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
            search: false,
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            search: false,
            editable: true,
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        return (
                            <Tag key={tag}>
                                {tag}
                            </Tag>
                        )
                    })}
                </>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            editable: true,
            search: false,
            filters: true,
            onFilter: true,
            valueType: "select",
            valueEnum: {
                open: { text: "OPEN", status: "Default" },
                working: { text: "WORKING", status: "Processing" },
                done: { text: "DONE", status: "Success" },
                overdue: { text: "OVERDUE", status: "Error" },
            }
        },
        {
            title: "Action",
            key: 'action',
            search: false,
            render: (_, record) => {
                const editable = isEditing(record);
                return (<Space size="middle">
                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => handleDel(record.id)}
                    >
                        <Button type="primary" >Delete</Button>
                    </Popconfirm>
                    {
                        editable ? (
                            <span>
                                <Typography.Link
                                    onClick={() => save(record.id)}
                                    style={{
                                        marginRight: 8,
                                    }}
                                >
                                    Save
                                </Typography.Link>
                                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                    <a>Cancel</a>
                                </Popconfirm>
                            </span>
                        ) : (
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                Edit
                            </Typography.Link>
                        )}
                    {/* <Button type="primary" onClick={() => { handleEdit(record.id) }}  >Edit</Button> */}
                </Space>)
            }

        }
    ]

    // console.log(useGlobelContext());

    // const [state, setState] = useState(data)


    // console.log(state);

    const handleDel = id => {

        let newState = state.filter((task) => {

            if (task.id !== id) {
                return task
            }
        })

        setState(newState)
    }


    const search = value => {
        // const { baseData } = this.state;
        // console.log("PASS", { value });
        if (!value) {
            return
        }
        let filterTableDates = data.filter((item) => {
            let ds = moment(item.timeStamp).format("YYYY - MM - DD")
            ds = ds.replace(/ +/g, "");

            let ds2 = moment(item.timeStamp).format("YYYY - MM - DD")
            ds2 = ds2.replace(/ +/g, "");


            // console.log(value.length, ds.length);
            if (ds.includes(value) || ds2.includes(value)) {
                return item
            }
        })

        let filterTable = data.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(value.toLowerCase())
            )
        );

        let finalT = [...filterTable, ...filterTableDates]

        // console.log(filterTable);
        setState(Array.from(new Set(finalT)));
    };


    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {

        // console.log(record);
        let inputNode = null;
        // inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

        inputNode = <Input></Input>

        if (dataIndex === "title" || dataIndex === "description") {
            inputNode = <Input></Input>
        }

        if (dataIndex === "description") {
            inputNode = <TextArea></TextArea>
        }

        // console.log(record?.timeStamp);

        if (dataIndex === "timeStamp") {
            inputNode = <Input disabled></Input>

        }

        if (dataIndex === "tags") {
            inputNode = <div>
                {
                    record.tags.map((tag, index) => {
                        return (
                            <Tag key={tag}>{tag}</Tag>
                        )
                    })
                }

            </div>
        }

        const dateObject = moment(record?.dueDate, 'ddd MMM DD YYYY').toDate();

        // console.log(dateObject);

        // if (dataIndex === "dueDate" && dateObject) {
        //     inputNode = <DatePicker value={dateObject} ></DatePicker>

        // }

        if (dataIndex === "status") {
            inputNode = <Select options={[
                {
                    value: 'open',
                    label: 'OPEN',
                },
                {
                    label: 'WORKING',
                    value: 'working',
                },
                {
                    value: 'overdue',
                    label: 'OVERDUE',
                },
                {
                    value: 'done',
                    label: 'DONE',
                },
            ]} ></Select>
        }

        // if (dataIndex === "tags") {
        //     inputNode = <Tag></Tag>
        // }



        // console.log(inputType, dataIndex);

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const [form] = Form.useForm();
    // const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            timeStamp: '',
            title: '',
            description: '',
            dueDate: '',
            ...record,
        });
        setEditingKey(record.id);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...state];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setState(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setState(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleShowModel = () => {
        form.resetFields();
        // setEdit(false)
        showModal();
    }


    return (

        <ConfigProvider locale={enUS}>
            <Input.Search
                style={{ border: "3px solid red", margin: "0 0 10px 0" }}
                placeholder="Search by..."
                enterButton
                onSearch={search}
            />
            <Form form={form} component={false} >
                <ProTable
                    columns={mergedColumns}

                    components={{

                        body: {
                            cell: (props) => {
                                // console.log(props);
                                return <EditableCell  {...props} />
                            }
                        }
                    }}

                    dataSource={state}
                    pagination={{
                        pageSize: 5,
                    }}
                    bordered
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleShowModel} >
                            Add Task
                        </Button>
                    ]}
                    search={false}
                ></ProTable>
            </Form>
            <InputModal></InputModal>
        </ConfigProvider >

    )
}

export default Table


