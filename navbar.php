<?php
session_start();
?>
<link rel="stylesheet" href="components/navbar.css">

<?php if (isset($_SESSION['user_email'])): ?>
   <!-- Logged-in Navbar HTML --> 
   <header class="navbar-container">
       <header data-thq="thq-navbar" class="navbar-navbar-interactive">
           <a href="index.html" class="navbar-navlink">
               <img alt="logo" src="public/alaalafh%202-200h.png" class="navbar-image" />
           </a>
           <div data-thq="thq-navbar-nav" class="navbar-desktop-menu">
               <nav class="navbar-links">
                   <a href="index.html" class="navbar-link1 thq-body-small thq-link">HOME</a>
                   <div
                  data-thq="thq-dropdown"
                  class="navbar-thq-dropdown list-item"
                >
                  <div
                    data-thq="thq-dropdown-toggle"
                    class="navbar-dropdown-toggle thq-body-small thq-link"
                  >
                    <span class="navbar-text">SERVICES</span>
                    <div
                      data-thq="thq-dropdown-arrow"
                      class="navbar-dropdown-arrow"
                    ></div>
                  </div>
                  <ul data-thq="thq-dropdown-list" class="navbar-dropdown-list">
                    <li
                      data-thq="thq-dropdown"
                      class="navbar-dropdown list-item"
                    >
                      <a href="packages.html">
                        <div
                          data-thq="thq-dropdown-toggle"
                          class="navbar-dropdown-toggle1"
                        >
                          <span class="navbar-text01">PACKAGES</span>
                        </div>
                      </a>
                    </li>
                    <li
                      data-thq="thq-dropdown"
                      class="navbar-dropdown1 list-item"
                    >
                      <a href="livestreamhm.html">
                        <div
                          data-thq="thq-dropdown-toggle"
                          class="navbar-dropdown-toggle2"
                        >
                          <span class="navbar-text02">LIVESTREAM</span>
                        </div>
                      </a>
                    </li>
                    <li
                      data-thq="thq-dropdown"
                      class="navbar-dropdown2 list-item"
                    >
                    <a href="products.html">
                      <div
                        data-thq="thq-dropdown-toggle"
                        class="navbar-dropdown-toggle3"
                      >
                        <span class="navbar-text03">
                          <span>PRODUCTS</span>
                          <br />
                        </span>
                      </div>
                    </a>
                    </li>
                  </ul>
                </div>
                <a
                  href="obituaryg.html"
                  class="navbar-link3 thq-body-small thq-link"
                >
                  <span>OBITUARY</span>
                </a>
                <a
                href="chapel.html"
                 class="thq-body-small thq-link">
                  <span>CHAPEL</span></span>
                </a>
                <a
                  href="contact.html"
                  class="navbar-link5 thq-body-small thq-link"
                >
                  <span>CONTACT US</span>
                </a>
               </nav>
               <div class="cart-button">
                  <a href="javascript:void(0);" id="cartButton">
                      <img src="public/cart.png" alt="cart" width="45px" height="45px">
                  </a>
              </div>
               <div class="navbar-buttons">
                   <a href="profile.html" class="navbar-action thq-button-filled">
                       <img src="public/account.png" alt="Account" width="21px" height="21px"/>
                   </a>
                   <a href="logout.php" class="navbar-action thq-button-animated thq-button-outline">
                       LOG OUT
                   </a>
               </div>
           </div>
       </header>
   </header>
<?php else: ?>
   <!-- Logged-out Navbar HTML -->
   <header class="navbar-container">
       <header data-thq="thq-navbar" class="navbar-navbar-interactive">
           <a href="index.html" class="navbar-navlink">
               <img alt="logo" src="public/alaalafh%202-200h.png" class="navbar-image" />
           </a>
           <div data-thq="thq-navbar-nav" class="navbar-desktop-menu">
               <nav class="navbar-links">
                   <a href="index.html" class="navbar-link1 thq-body-small thq-link">HOME</a>
                   <div
                  data-thq="thq-dropdown"
                  class="navbar-thq-dropdown list-item"
                >
                  <div
                    data-thq="thq-dropdown-toggle"
                    class="navbar-dropdown-toggle thq-body-small thq-link"
                  >
                    <span class="navbar-text">SERVICES</span>
                    <div
                      data-thq="thq-dropdown-arrow"
                      class="navbar-dropdown-arrow"
                    ></div>
                  </div>
                  <ul data-thq="thq-dropdown-list" class="navbar-dropdown-list">
                    <li
                      data-thq="thq-dropdown"
                      class="navbar-dropdown list-item"
                    >
                      <a href="packages.html">
                        <div
                          data-thq="thq-dropdown-toggle"
                          class="navbar-dropdown-toggle1"
                        >
                          <span class="navbar-text01">PACKAGES</span>
                        </div>
                      </a>
                    </li>
                    <li
                      data-thq="thq-dropdown"
                      class="navbar-dropdown1 list-item"
                    >
                      <a href="livestreamhm.html">
                        <div
                          data-thq="thq-dropdown-toggle"
                          class="navbar-dropdown-toggle2"
                        >
                          <span class="navbar-text02">LIVESTREAM</span>
                        </div>
                      </a>
                    </li>
                    <li
                      data-thq="thq-dropdown"
                      class="navbar-dropdown2 list-item"
                    >
                    <a href="products.html">
                      <div
                        data-thq="thq-dropdown-toggle"
                        class="navbar-dropdown-toggle3"
                      >
                        <span class="navbar-text03">
                          <span>PRODUCTS</span>
                          <br />
                        </span>
                      </div>
                    </a>
                    </li>
                  </ul>
                </div>
                <a
                  href="obituaryg.html"
                  class="navbar-link3 thq-body-small thq-link"
                >
                  <span>OBITUARY</span>
                </a>
                <a
                href="chapel.html"
                 class="thq-body-small thq-link">
                  <span>CHAPEL</span></span>
                </a>
                <a
                  href="contact.html"
                  class="navbar-link5 thq-body-small thq-link"
                >
                  <span>CONTACT US</span>
                </a>
               </nav>
               <div class="navbar-buttons">
                   <a href="login.html" class="navbar-action1 thq-button-filled thq-button-animated">
                       LOG IN
                   </a>
                   <a href="signup.html" class="navbar-action2 thq-button-animated thq-button-outline">
                       SIGN UP
                   </a>
               </div>
           </div>
       </header>
   </header>
<?php endif; ?>
