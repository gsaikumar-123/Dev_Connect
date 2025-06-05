import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 fixed bottom-0 p-4 text-base-content">
        <aside>
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
    </footer>
    </div>
  )
}

export default Footer
