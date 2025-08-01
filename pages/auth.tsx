import { Layout } from '../src/components/layout/Layout';
import AuthOTP from '../src/components/auth/AuthOTP';

const AuthPage = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen p-8 bg-background">
        <AuthOTP />
      </div>
    </Layout>
  );
};

export default AuthPage;
