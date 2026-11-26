<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Products - Shop</title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <nav>
                <div class="nav-links">
                    <a class="nav-brand" href="${pageContext.request.contextPath}/products">Shop</a>
                    <a href="${pageContext.request.contextPath}/cart">Cart</a>
                    <c:if test="${sessionScope.userRole == 'ADMIN'}">
                        <a href="${pageContext.request.contextPath}/admin/dashboard">Admin Dashboard</a>
                    </c:if>
                </div>
                <div class="nav-user">
                    <c:choose>
                        <c:when test="${not empty sessionScope.userEmail}">
                            <span class="nav-user-email"><c:out value="${sessionScope.userEmail}" /></span>
                            <a href="${pageContext.request.contextPath}/logout">Logout</a>
                        </c:when>
                        <c:otherwise>
                            <a href="${pageContext.request.contextPath}/login">Login</a>
                        </c:otherwise>
                    </c:choose>
                </div>
            </nav>

            <div class="container">
                <div class="page-header">
                    <h2>Products</h2>
                </div>

                <c:if test="${empty products}">
                    <div class="empty-state">
                        <p>No products available yet.</p>
                    </div>
                </c:if>

                <div class="product-grid">
                    <c:forEach var="p" items="${products}">
                        <div class="card">
                            <div class="card-media">
                                <c:choose>
                                    <c:when test="${not empty p.imageUrl}">
                                        <img class="card-img" src="<c:out value='${p.imageUrl}' />" alt="<c:out value='${p.name}' />" />
                                    </c:when>
                                    <c:otherwise>
                                        <div class="card-media-placeholder">No Image</div>
                                    </c:otherwise>
                                </c:choose>
                            </div>
                            <div class="card-body">
                                <div>
                                    <h3>
                                        <c:out value="${p.name}" />
                                    </h3>
                                    <div class="card-meta">
                                        <span class="price">₹<c:out value="${p.price}" /></span>
                                        <c:choose>
                                            <c:when test="${p.stock > 5}">
                                                <span class="badge badge-in-stock">In Stock (<c:out value="${p.stock}" />)</span>
                                            </c:when>
                                            <c:when test="${p.stock > 0}">
                                                <span class="badge badge-low-stock">Only <c:out value="${p.stock}" /> left</span>
                                            </c:when>
                                            <c:otherwise>
                                                <span class="badge badge-out-of-stock">Out of Stock (<c:out value="${p.stock}" />)</span>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                </div>
                                <a class="btn btn-full" href="${pageContext.request.contextPath}/products?id=${p.id}">View Details</a>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>
        </body>

        </html>