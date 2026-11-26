<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Dashboard - Shop</title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <div class="container">
                <div class="page-header">
                    <h2>Admin Dashboard</h2>
                    <div class="page-actions">
                        <a class="btn" href="${pageContext.request.contextPath}/admin/products/form">+ Add New Product</a>
                        <a class="btn btn-outline" href="${pageContext.request.contextPath}/products">View Storefront</a>
                        <a class="btn btn-danger" href="${pageContext.request.contextPath}/logout">Logout</a>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="p" items="${products}">
                                <tr>
                                    <td>
                                        #<c:out value="${p.id}" />
                                    </td>
                                    <td>
                                        <strong><c:out value="${p.name}" /></strong>
                                    </td>
                                    <td>₹
                                        <c:out value="${p.price}" />
                                    </td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${p.stock > 5}">
                                                <span class="badge badge-in-stock"><c:out value="${p.stock}" /> in stock</span>
                                            </c:when>
                                            <c:when test="${p.stock > 0}">
                                                <span class="badge badge-low-stock"><c:out value="${p.stock}" /> left</span>
                                            </c:when>
                                            <c:otherwise>
                                                <span class="badge badge-out-of-stock"><c:out value="${p.stock}" /></span>
                                            </c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td>
                                        <div class="table-actions">
                                            <a class="btn btn-outline btn-sm" href="${pageContext.request.contextPath}/admin/products/form?id=${p.id}">Edit</a>
                                            <form method="post" action="${pageContext.request.contextPath}/admin/products/delete"
                                                style="display:inline;">
                                                <input type="hidden" name="csrfToken" value="${sessionScope.csrfToken}" />
                                                <input type="hidden" name="id" value="${p.id}" />
                                                <button type="submit" class="btn btn-danger btn-sm"
                                                    onclick="return confirm('Delete this product?');">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </div>
        </body>

        </html>