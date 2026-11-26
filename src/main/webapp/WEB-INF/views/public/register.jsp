<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Register - Shop</title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <div class="container">
                <div class="form-card">
                    <h2>Create Account</h2>
                    <p class="form-subtitle">Join to start adding items to your cart.</p>

                    <c:if test="${not empty error}">
                        <div class="alert-error">
                            <c:out value="${error}" />
                        </div>
                    </c:if>

                    <form method="post" action="${pageContext.request.contextPath}/register">
                        <input type="hidden" name="csrfToken" value="${sessionScope.csrfToken}" />

                        <label>Email</label>
                        <input type="email" name="email" required />

                        <label>Password (8+ characters)</label>
                        <input type="password" name="password" minlength="8" required />

                        <button type="submit" class="btn btn-full">Register</button>
                    </form>

                    <p class="form-footer">Already have an account? <a href="${pageContext.request.contextPath}/login">Log in</a></p>
                </div>
            </div>
        </body>

        </html>