import {
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Input,
  Button,
  Typography,
  Tag,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();

  // 模拟数据
  const statsData = {
    totalNotes: 45,
    weeklyNew: 3,
    categories: 8,
    recentNotes: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      title: `笔记标题 ${i + 1}`,
      content: '笔记摘要内容...',
      category: '技术笔记',
    })),
    commonCategories: ['技术文档', '生活随笔', '项目计划', '学习笔记'],
  };

  return (
    <Layout>
      <Navbar />
      <Content className="bg-gray-50 min-h-screen">
        {/* 欢迎区域和统计面板 */}
        <Card className="mb-6">
          {user ? (
            <div className="flex justify-between items-center">
              <Title
                level={3}
              >{`${user.nickname || user.username}的工作台`}</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="总笔记数" value={45} />
                </Col>
                <Col span={8}>
                  <Statistic title="本周新增" value={3} />
                </Col>
                <Col span={8}>
                  <Statistic title="分类数量" value={8} />
                </Col>
              </Row>
            </div>
          ) : (
            <Title level={3}>欢迎来到笔记应用</Title>
          )}
        </Card>

        {/* 主内容区 */}
        <div className="p-6">
          <Row gutter={24}>
            {/* 最近笔记瀑布流 */}
            <Col xs={24} md={18}>
              <Card title="最近笔记" className="mb-6">
                <Row gutter={[16, 16]}>
                  {statsData.recentNotes.map((note) => (
                    <Col span={12} key={note.id}>
                      <Card hoverable className="h-full">
                        <h4 className="text-lg font-medium mb-2">
                          {note.title}
                        </h4>
                        <p className="text-gray-600 mb-3">{note.content}</p>
                        <Tag color="blue">{note.category}</Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            {/* 分类入口 */}
            <Col xs={24} md={6}>
              <Card title="常用分类" className="mb-6">
                <div className="space-y-2">
                  {statsData.commonCategories.map((category) => (
                    <Button
                      key={category}
                      block
                      className="text-left"
                      onClick={() => navigate(`/category/${category}`)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          {/* 快速创建面板 */}
          <Card title="快速记录" className="mt-6">
            <div className="flex gap-4">
              <Input.TextArea
                rows={2}
                placeholder="记录你的灵感..."
                className="flex-1"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/create-note')}
              >
                创建笔记
              </Button>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
