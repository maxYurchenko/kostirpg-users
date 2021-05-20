const portal = __non_webpack_require__("/lib/xp/portal");
const thymeleaf = __non_webpack_require__("/lib/thymeleaf");
const mailLib = __non_webpack_require__("/lib/xp/mail");
const utils = __non_webpack_require__("/lib/util");

import * as sharedLib from "./sharedLib";

export { sendMail };

const mailsTemplates = {
  userActivation: "../../../mails/userActivation.html",
  forgotPass: "../../../mails/forgotPass.html"
};

const components = {
  head: "../../../mails/components/head.html",
  header: "../../../mails/components/header.html",
  footer: "../../../mails/components/footer.html"
};

function getMailComponents(params: MailComponentsParams) {
  if (!params) {
    params = { title: "" };
  }
  if (!params.title) {
    params.title = "";
  }
  var site = sharedLib.getSite();
  return {
    head: thymeleaf.render(resolve(components.head), { title: params.title }),
    header: thymeleaf.render(resolve(components.header), { site: site }),
    footer: thymeleaf.render(resolve(components.footer), {})
  };
}

function sendMail(type: string, email: string, params: MailParams) {
  var mail = null;
  if (type === "forgotPass") {
    mail = getForgotPassMail(email, params);
  } else {
    mail = getActivationMail(email, params);
  }
  email = utils.data.forceArray(email);
  for (var i = 0; i < email.length; i++) {
    mailLib.send({
      from: "Vecherniye Kosti <noreply@kostirpg.com>",
      to: [email[i]],
      subject: mail.subject,
      body: mail.body,
      replyTo: "Vecherniye Kosti <info@kostirpg.com>",
      contentType: 'text/html; charset="UTF-8"',
      headers: {
        "MIME-Version": "1.0"
      }
    });
  }
}

function getActivationMail(mail: string, params: MailParams): Mail {
  var activationUrl = portal.serviceUrl({
    service: "user",
    type: "absolute",
    params: {
      mail: encodeURI(mail),
      action: "confirmRegister",
      hash: params.hash
    }
  });
  return {
    body: thymeleaf.render(resolve(mailsTemplates.userActivation), {
      activationUrl: activationUrl,
      mailComponents: getMailComponents({
        title: "Активация аккаунта"
      }),
      site: sharedLib.getSite()
    }),
    subject: "Активация аккаунта"
  };
}

function getForgotPassMail(mail: string, params: MailParams): Mail {
  var resetUrl = portal.serviceUrl({
    service: "user",
    type: "absolute",
    params: {
      action: "forgotPass",
      email: encodeURI(mail),
      hash: params.hash
    }
  });
  return {
    body: thymeleaf.render(resolve(mailsTemplates.forgotPass), {
      resetUrl: resetUrl,
      site: sharedLib.getSite(),
      mailComponents: getMailComponents({ title: "Смена пароля" })
    }),
    subject: "Смена пароля"
  };
}

interface MailComponentsParams {
  title?: string;
}

interface MailParams {
  hash: string;
}

interface Mail {
  body: string;
  subject: string;
}
