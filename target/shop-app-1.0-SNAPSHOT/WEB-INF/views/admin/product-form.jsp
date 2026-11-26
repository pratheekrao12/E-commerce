<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${empty product ? 'Add Product' : 'Edit Product'}</title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <div class="container">
                <div class="form-card">
                    <h2>${empty product ? 'Add New Product' : 'Edit Product'}</h2>

                    <c:if test="${not empty error}">
                        <div class="alert-error">
                            <c:out value="${error}" />
                        </div>
                    </c:if>

                    <form method="post" action="${pageContext.request.contextPath}/admin/products/save">
                        <input type="hidden" name="csrfToken" value="${sessionScope.csrfToken}" />
                        <c:if test="${not empty product}">
                            <input type="hidden" name="id" value="${product.id}" />
                        </c:if>

                        <label>Name</label>
                        <input type="text" name="name" value="<c:out value='${product.name}'/>" required />

                        <label>Description</label>
                        <textarea name="description" rows="4"
                            cols="40"><c:out value="${product.description}"/></textarea>

                        <label>Price</label>
                        <input type="number" step="0.01" min="0" name="price" value="<c:out value='${product.price}'/>"
                            required />

                        <label>Stock</label>
                        <input type="number" min="0" name="stock" value="<c:out value='${product.stock}'/>"
                            required />

                        <label>Image URL (optional)</label>
                        <input type="text" name="imageUrl" value="<c:out value='${product.imageUrl}'/>" />

                        <div class="form-actions">
                            <button type="submit" class="btn">Save Product</button>
                            <a class="btn btn-outline" href="${pageContext.request.contextPath}/admin/dashboard">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </body>

        </html>