import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, message, Select } from 'antd'; //引入Ant Design组件
import { updateNote, getNote } from '@/api/noteApi'; //引入更新笔记和获取笔记的API
import { getCategories } from '@/api/categoryApi'; //引入获取分类的API
import { useStore } from '@/store/userStore'; //引入全局状态管理
import { useNavigate, useParams } from 'react-router-dom'; //引入React Router的导航和路由参数钩
import Navbar from '@/components/Navbar'; //引入导航栏组件编辑笔记页面组件

const EditNote = () => {
  const navigate = useNavigate(); //获取导航函数
  const { noteId } = useParams(); //从路由参数中获取笔记ID
  const { user } = useStore(); //从全局状态中获取当前用户信息
  const [tags, setTags] = useState([]); //标签状态，用于存储笔记的标签
  const [inputTag, setInputTag] = useState(''); //输入框中的标签内容
  const [categories, setCategories] = useState([]); //分类状态，用于存储从API获取的分类数据
  const [form] = Form.useForm(); //使用Ant Design的Form useForm钩子管理表单
  const [noteData, setNoteData] = useState(null);

  //使用useFffect钩子在组件加载时获取笔记和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        //同时请求笔记数据和分类数据
        const [noteResponse, categoriesResponse] = await Promise.all([
          getNote(noteId), // 获取当前编辑的笔记
          getCategories(), // 获取所有分类
        ]);
        const fetchedNoteData = noteResponse.data; //获取笔记数据
        setNoteData(fetchedNoteData); //更新笔记数据状态
        setTags(fetchedNoteData.tags); // 设置笔记的标签
        setCategories(categoriesResponse.data); //设置分类数据
      } catch (error) {
        console.error('Failed to fetch data:', error); //打印错误信息
        message.error('获取数据失败'); //使用Ant Design的message组件显示错误提示
      }
    };
    fetchData();
  }, [noteId]); //依赖项为noteId

  //单独的useEffect来处理表单数据的设置
  useEffect(() => {
    if (noteData) {
      form.setFieldsValue({
        title: noteData.title,
        content: noteData.content,
        categoryId: noteData.category_id,
        tags: noteData.tags,
      });
      setTags(noteData.tags || []);
    }
  }, [noteData, form]); //依赖于noteData和form

  //提交表单时的处理函数
  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values, //展开表单提交的值
        tags,
        userid: user.id, //添加当前用户的ID
      };
      await updateNote(noteId, noteData); //调用API更新笔记
      message.success('笔记更新成功'); //显示成功提示
      navigate('/notes'); // 导航到笔记列表页面
    } catch (error) {
      console.error('Failed to update note:', error); //打印错误信息
      message.error('更新笔记失败'); //显示失败提示
    }
  };

  // 输入框内容变化时的处理函数
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value); // 更新输入框中的标签内容
  };
  //添加标签的处理函数
  const handleAddTag = () => {
    //如果输入框中有内容且标签未重复
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]); // 将新标签添加到标签列表中
      setInputTag(''); // 清空输入框
    }
  };

  // 删除标签的处理函数
  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag); //过滤掉要删除的标签
    setTags(newTags); //更新标益列表
  };

  //渲染组件
  return (
    <>
      <Navbar />
      {/*渲染导航栏组件*/}
      <div className="p-4">
        <h1>编辑笔记</h1>
        <Form
          form={form} //绑定表单实例
          onFinish={handleSubmit} //表单提交时调用handleSubmit函数
          layout="vertical" //表单布局为垂直
          className="max-w-2xl mx-auto" //样式：最大宽度为2xl,居中
        >
          <Form.Item
            label="标题" // 标签文本
            name="title" //表单字段名称
            rules={[{ required: true, message: '请输入笔记标题' }]} //验证规则：标题必填
          >
            <Input placeholder="请输入笔记标题" />
            {/*输入框组件*/}
          </Form.Item>

          <Form.Item
            label="内容" //标签文本
            name="content" //表单字段名称
            rules={[{ required: true, message: '请输入笔记内容' }]} //验证规则：内容必填
          >
            <Input.TextArea rows={6} placeholder="请输入笔记内容" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="categoryId" //表单字段名称
            rules={[{ required: true, message: '请选择笔记类型' }]} //验证规则：分类必选
          >
            <Select placeholder="请选择笔记类型">
              {categories.map(
                (
                  category, //遍历分类数据
                ) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ),
              )}
            </Select>
          </Form.Item>

          {/* 标签输入和显示区域 */}
          <div className="mb-4">
            <label className="block mb-2">标签</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={inputTag}
                placeholder="输入标签"
                onChange={handleInputTagChange}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleAddTag();
                }}
              />
              {/*点击按钮时调用handleAddTag函数*/}
              <Button onClick={handleAddTag}>添加标签</Button>
              {/*点击按钮时调用handleAddTag凶数*/}
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map(
                (
                  tag, //遍历标签列表
                ) => (
                  <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
                    {/*标签组件*/}
                    {tag}
                  </Tag>
                ),
              )}
            </div>
          </div>

          {/*提交按钮*/}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              更新笔记
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditNote;
