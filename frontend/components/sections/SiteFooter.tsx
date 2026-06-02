export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo gap-2">
            <span className="logo-leaf" />
            PlantSell
          </div>
          <p>
            Premium plants and fertilizers delivered fresh to your home. We believe
            every space deserves a touch of nature.
          </p>
          <div className="footer-social">
            <a href="#" className="social-btn">X</a>
            <a href="#" className="social-btn">IG</a>
            <a href="#" className="social-btn">FB</a>
            <a href="#" className="social-btn">YT</a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><a href="#">Indoor Plants</a></li>
            <li><a href="#">Fertilizers</a></li>
            <li><a href="#">Small Trees</a></li>
            <li><a href="#">Flowering Shrubs</a></li>
            <li><a href="#">Bonsai</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Delivery</h5>
          <ul>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Delivery Areas</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Nursery</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright 2026 GreenRoots. All rights reserved.</p>
        <div className="payment-icons">
          <div className="pay-icon">UPI</div>
          <div className="pay-icon">VISA</div>
          <div className="pay-icon">MC</div>
          <div className="pay-icon">COD</div>
        </div>
      </div>
    </footer>
  );
}
