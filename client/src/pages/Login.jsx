import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await loginUser(values);
      setUser(response.data); // 设置用户信息
      alert('登录成功');
      navigate('/'); // 跳转到主页
    } catch (error) {
      console.error('Login failed:', error);
      alert('用户名或密码错误');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 mx-auto space-y-6">
        <Title level={2} className="text-center text-gray-800 mb-6">
          登录
        </Title>
        <Form name="login_form" onFinish={onFinish} className="space-y-4">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              className="rounded-lg py-2 hover:border-blue-400 focus:border-blue-400"
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-lg py-2 hover:border-blue-400 focus:border-blue-400"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center text-sm text-gray-600">
          还没有账号？
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
          >
            去注册
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
