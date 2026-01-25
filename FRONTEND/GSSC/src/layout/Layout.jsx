import Header from './Header.jsx'
import Footer from './Footer.jsx'

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout

