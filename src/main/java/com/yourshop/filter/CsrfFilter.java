package com.yourshop.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

@WebFilter("/*")
public class CsrfFilter implements Filter {
    private static final SecureRandom random = new SecureRandom();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String path = request.getRequestURI().substring(request.getContextPath().length());
        if (path.startsWith("/assets/")) {
            chain.doFilter(req, res);
            return;
        }

        HttpSession session = request.getSession(true);

        if (session.getAttribute("csrfToken") == null) {
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            session.setAttribute("csrfToken", Base64.getUrlEncoder().withoutPadding().encodeToString(bytes));
        }

        if ("POST".equalsIgnoreCase(request.getMethod())) {
            String sessionToken = (String) session.getAttribute("csrfToken");
            String formToken = request.getParameter("csrfToken");

            if (sessionToken == null || !sessionToken.equals(formToken)) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token");
                return;
            }
        }

        chain.doFilter(req, res);
    }
}