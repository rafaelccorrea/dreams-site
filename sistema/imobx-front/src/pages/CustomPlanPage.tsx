import React from 'react';
import { Layout } from '../components/layout/Layout';
import { CustomPlanBuilder } from '../components/plans/CustomPlanBuilder';

const CustomPlanPage: React.FC = () => {
  return (
    <Layout>
      <CustomPlanBuilder />
    </Layout>
  );
};

export default CustomPlanPage;
