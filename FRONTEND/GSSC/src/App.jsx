import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SolarCalculatorPage from './pages/SolarCalculatorPage.jsx'
import PowerCalculatorPage from './pages/PowerCalculatorPage.jsx'
import PriceTrackerPage from './pages/PriceTrackerPage.jsx'
import QuotationGeneratorPage from './pages/QuotationGeneratorPage.jsx'
import AIChatbotPage from './pages/AIChatbotPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import OTPRequestPage from './pages/OTPRequestPage.jsx'
import OTPVerifyPage from './pages/OTPVerifyPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Routes with full shell (header + footer) */}
      <Route
        path="/"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
      <Route
        path="/calculator/solar"
        element={
          <Layout>
            <SolarCalculatorPage />
          </Layout>
        }
      />
      <Route
        path="/calculator/power"
        element={
          <Layout>
            <PowerCalculatorPage />
          </Layout>
        }
      />
      <Route
        path="/price-tracker"
        element={
          <Layout>
            <PriceTrackerPage />
          </Layout>
        }
      />
      <Route
        path="/quotation-generator"
        element={
          <Layout>
            <QuotationGeneratorPage />
          </Layout>
        }
      />
      <Route
        path="/ai-chatbot"
        element={
          <Layout>
            <AIChatbotPage />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactPage />
          </Layout>
        }
      />
      <Route
        path="/change-password"
        element={
          <Layout>
            <ChangePasswordPage />
          </Layout>
        }
      />

      {/* Auth routes without header/footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/request-otp" element={<OTPRequestPage />} />
      <Route path="/verify-otp" element={<OTPVerifyPage />} />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
