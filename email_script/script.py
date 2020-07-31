import json
import requests
import requests.auth
from datetime import date, datetime
from string import Template
# Import smtplib for the actual sending function
import smtplib
# Import the email modules we'll need
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from decouple import config

# Sender account
FROM_MA = config('EMAIL_MA')
CLAVE = config('PASSWORD_MA')

apiuser = config('API_USER')
apipass = config('API_PASS')

api_url_base = config('API_URL')

def read_template(filename):
    with open(filename, 'r') as template_file:
        template_file_content = template_file.read()
    return Template(template_file_content)

# Set up the SMTP server
s = smtplib.SMTP(host='smtp-mail.outlook.com', port=587) #smtp.office365.com
s.starttls()
s.login(FROM_MA, CLAVE)
# Get message template
message_template = read_template("email_message.txt")

try:
	donations_r = requests.get(api_url_base+"donation/", auth=(apiuser, apipass))
	if(donations_r):
		jDonations = json.loads(donations_r.content)
		#print(jDonations)
		actual_date = datetime.now().date()
		#print("FECHA DE HOY: "+str(actual_date)+"\n")
		for d in jDonations:
			#print("ID Donation: ", d['id'])
			end_date = d['expirationDate']
			userids = d['users']
			description = d['description']
			state_d = d['state']
			if(state_d == 1 and end_date!=None):
				#print(userids)
				for u in userids:
					user_r = requests.get(api_url_base+"user/"+str(u), auth=(apiuser, apipass))
					jUsers = json.loads(user_r.content)
					#print(jUsers)
					email_to = jUsers['email']
					#print("Email: "+email_to)
					difference_days = (datetime.strptime(end_date,"%Y-%m-%d").date() - actual_date).days
					#print("Diferencia de días = "+str(difference_days)+"\n")
					if(difference_days>=1 and difference_days<=14):
						try:
							#print("Entra en try de msg\n")
							msg = MIMEMultipart() # create a message
							# add in the actual days left to the message template
							message = message_template.substitute(DESCRIPTION=str(description), END_DATE=str(end_date))
							# setup the parameters of the message
							msg['From']=FROM_MA
							msg['To']=email_to
							msg['Subject']="Alerta de vencimiento de donación"
							# add in the message body
							msg.attach(MIMEText(message, 'plain'))
							# send the message via the server set up earlier.
							s.send_message(msg)
							print("Se envió mensaje\n")
							del msg
						except:
							print("Error sending email")
except:
   	print("Error requests")
