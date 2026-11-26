<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>
                <c:out value="${product.name}" /> - Shop
            </title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <div class="container">
                <a class="back-link" href="${pageContext.request.contextPath}/products">← Back to Products</a>

                <div class="product-detail-layout">
                    <c:if test="${not empty product.imageUrl}">
                        <div class="detail-media">
                            <img class="detail-img" src="<c:out value='${product.imageUrl}' />" alt="<c:out value='${product.name}' />" />
                        </div>
                    </c:if>

                    <div>
                        <div class="detail-info-card">
                            <h2>
                                <c:out value="${product.name}" />
                            </h2>
                            <c:choose>
                                <c:when test="${product.stock > 5}">
                                    <span class="badge badge-in-stock">In Stock (<c:out value="${product.stock}" />)</span>
                                </c:when>
                                <c:when test="${product.stock > 0}">
                                    <span class="badge badge-low-stock">Only <c:out value="${product.stock}" /> left</span>
                                </c:when>
                                <c:otherwise>
                                    <span class="badge badge-out-of-stock">Out of Stock (<c:out value="${product.stock}" />)</span>
                                </c:otherwise>
                            </c:choose>

                            <p class="detail-description">
                                <c:out value="${product.description}" />
                            </p>

                            <div class="detail-price-row">
                                <span class="price">₹<c:out value="${product.price}" /></span>
                            </div>
                        </div>

                        <div class="form-card">
                            <form method="post" action="${pageContext.request.contextPath}/cart/add">
                                <input type="hidden" name="csrfToken" value="${sessionScope.csrfToken}" />
                                <input type="hidden" name="productId" value="${product.id}" />
                                <label>Quantity</label>
                                <input type="number" name="quantity" value="1" min="1" max="${product.stock}" required />
                                <button type="submit" class="btn btn-full">Add to Cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </body>

        </html>