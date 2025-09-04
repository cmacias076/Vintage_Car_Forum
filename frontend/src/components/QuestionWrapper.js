import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import QuestionDetail from './QuestionDetail';

function QuestionWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/question/:id" element={<QuestionDetail />} />
    </Routes>
  );
}

export default QuestionWrapper;
