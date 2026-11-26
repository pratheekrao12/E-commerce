<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="jakarta.tags.core" %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login - Shop</title>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/style.css">
        </head>

        <body>
            <div class="container">
                <div class="form-card">
                    <h2>Welcome back</h2>
                    <p class="form-subtitle">Sign in to your account to continue shopping.</p>

                    <c:if test="${param.registered == 'true'}">
                        <div class="alert-success">Account created. Please log in.</div>
                    </c:if>

                    <c:if test="${not empty error}">
                        <div class="alert-error">
                            <c:out value="${error}" />
                        </div>
                    </c:if>

                    <form method="post" action="${pageContext.request.contextPath}/login">
                        <input type="hidden" name="csrfToken" value="${sessionScope.csrfToken}" />

                        <label>Email</label>
                        <input type="email" name="email" required />

                        <label>Password</label>
                        <input type="password" name="password" minlength="8" required />

                        <button type="submit" class="btn btn-full">Log In</button>
                    </form>

                    <p class="form-footer">New here? <a href="${pageContext.request.contextPath}/register">Create an account</a></p>
                </div>
            </div>
        </body>

        </html>