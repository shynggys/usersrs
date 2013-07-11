package org.jboss.as.quickstarts.usersrs.reader;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jboss.as.quickstarts.usersrs.model.User;
import org.jboss.as.quickstarts.usersrs.model.UserDao;

@WebServlet(urlPatterns = "/avea.php")
public class Reader extends HttpServlet {
	@Inject
	private UserDao userDao;
	private int remote_open = 1;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		resp.setHeader("Access-Control-Allow-Origin", "*");
		resp.setCharacterEncoding("UTF-8");
		
		String cmd = req.getParameter("cmd");
		String mode = req.getParameter("mode");
		String codeStr = req.getParameter("uid");
		
		Long code = Long.parseLong(codeStr);
		
		Date now = new Date();
		DateFormat df = new SimpleDateFormat("y-m-d H:m:s");
		String newString = df.format(now);
				
		PrintWriter out = resp.getWriter();
		out.println("<AVEA>");
	
		if (cmd.equals("PU")) {
			out.println("CK="+newString);
			if (mode.equals("ID2"))
				out.println("DHCP=1");
		} else
		if (cmd.equals("CO")) {
			boolean ok = false;
	        for (User user : userDao.getAll())
	            if (user.getId().equals(code)) {
	            	out.println("MSG=3f737937");
	            	out.println("GRNT=01");
	            	ok = true;
	            	break;
	            }
	        if (!ok) {
	        	out.println("DENY");
	        }
		} else
		if (cmd.equals("HB")) {
			out.println("CK="+newString);
		} else
		if (cmd.equals("PG")) {
			out.println("GRNT=01");
		} else
		if (cmd.equals("SW"))
			if (remote_open == 1)
				out.println("GRNT=01");			
		
		out.println("</AVEA>");
	}	
}
