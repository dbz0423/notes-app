import { Form, Input, Button, Typography } from 'antd';
import { registerUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await registerUser(values);
      setUser(response.data); // 设置用户信息
      alert('注册成功');
      navigate('/login'); // 跳转到登录页面
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <Title
          level={3}
          className="text-center text-2xl font-medium text-gray-800"
        >
          注册
        </Title>
        <Form onFinish={onFinish} layout="vertical" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              name="username"
              label="用户名"
              className="text-sm font-medium text-gray-700"
            >
              <Input
                className="rounded-lg py-2 hover:border-blue-400 focus:border-blue-400"
                placeholder="请输入用户名"
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              className="text-sm font-medium text-gray-700"
            >
              <Input
                className="rounded-lg py-2 hover:border-blue-400 focus:border-blue-400"
                placeholder="请输入邮箱"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              className="text-sm font-medium text-gray-700"
            >
              <Input.Password
                className="rounded-lg py-2 hover:border-blue-400 focus:border-blue-400"
                placeholder="请输入密码"
              />
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          >
            立即注册
          </Button>
        </Form>
        <div className="text-center text-sm text-gray-600">
          已经有账号？
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
          >
            去登录
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
