<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Cart - Shop</title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <div class="container">
                <div class="page-header">
                    <h2>Your Shopping Cart</h2>
                    <div class="page-actions">
                        <a class="btn btn-outline" href="${pageContext.request.contextPath}/products">← Continue Shopping</a>
                    </div>
                </div>

                <c:choose>
                    <c:when test="${empty cartItems}">
                        <div class="empty-state">
                            <p>Your cart is empty.</p>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <div class="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="item" items="${cartItems}">
                                        <tr>
                                            <td>
                                                <strong><c:out value="${item.productName}" /></strong>
                                            </td>
                                            <td>₹
                                                <c:out value="${item.price}" />
                                            </td>
                                            <td>
                                                <c:out value="${item.quantity}" />
                                            </td>
                                            <td>₹
                                                <c:out value="${item.subtotal}" />
                                            </td>
                                            <td>
                                                <form method="post" action="${pageContext.request.contextPath}/cart/remove">
                                                    <input type="hidden" name="csrfToken" value="${sessionScope.csrfToken}" />
                                                    <input type="hidden" name="cartItemId" value="${item.id}" />
                                                    <button type="submit" class="btn btn-danger btn-sm">Remove</button>
                                                </form>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </div>
                        <div class="cart-summary">
                            <span class="cart-summary-label">Order Total</span>
                            <span class="price">₹<c:out value="${cartTotal}" /></span>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>
        </body>

        </html>