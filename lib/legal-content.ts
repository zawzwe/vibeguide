import type { AppLocale } from "@/i18n/routing";
import type { LegalSection } from "@/components/legal-document";
import { SUPPORT_EMAIL } from "@/lib/site-config";

type LegalDocumentContent = {
  title: string;
  updatedLabel: string;
  updatedAt: string;
  introduction: string;
  sections: LegalSection[];
};

type LegalContent = {
  privacy: LegalDocumentContent;
  terms: LegalDocumentContent;
};

const content: Record<AppLocale, LegalContent> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      updatedLabel: "Last updated",
      updatedAt: "July 16, 2026",
      introduction:
        "This Privacy Policy explains how VibeGuide, operated by Arakai in Shenzhen, Guangdong, China, collects, uses, stores, and shares information when you use our website and AI documentation service.",
      sections: [
        {
          title: "1. Information we collect",
          bullets: [
            "Account information, including your email address, user identifier, authentication records, and session information.",
            "Project content, including project descriptions, requirement answers, generated documents, and files or information you choose to submit.",
            "Purchase and transaction information, including the selected plan, order identifiers, payment status, and credits added to your account. We do not store complete payment-card details.",
            "Technical and usage information, such as IP address, browser and device information, visited pages, error logs, and interaction events.",
          ],
        },
        {
          title: "2. How we use information",
          bullets: [
            "Provide, maintain, secure, and improve VibeGuide.",
            "Authenticate users, manage accounts, projects, and project credits.",
            "Process project content and generate AI-assisted documentation.",
            "Process purchases, prevent fraud, troubleshoot errors, and provide customer support.",
            "Comply with legal obligations and enforce our Terms of Service.",
          ],
        },
        {
          title: "3. Service providers and data sharing",
          paragraphs: [
            "We share information only as needed to operate the service, comply with law, protect our users, or complete a transaction. We do not sell your personal information.",
          ],
          bullets: [
            "Supabase provides authentication and database infrastructure.",
            "DeepSeek processes project descriptions and requirement answers to generate documentation. Do not submit confidential, regulated, or sensitive personal information that is not necessary for your project.",
            "Vercel hosts the application and provides performance and analytics services.",
            "Creem processes international purchases as a merchant of record. ZPay and Alipay support purchases offered through the Chinese checkout flow. These providers process payment information under their own privacy terms.",
            "Professional advisers, authorities, or other parties may receive information when required by law or reasonably necessary to protect legal rights and service security.",
          ],
        },
        {
          title: "4. Cookies and similar technologies",
          paragraphs: [
            "VibeGuide uses essential cookies and local storage for authentication, security, language preferences, and theme settings. Analytics technologies may be used to understand service performance and usage. You can control non-essential cookies through your browser settings, although some features may stop working correctly.",
          ],
        },
        {
          title: "5. Retention and security",
          paragraphs: [
            "We retain account, project, and transaction records for as long as reasonably necessary to provide the service, meet legal and accounting obligations, resolve disputes, and prevent abuse. We use reasonable technical and organisational safeguards, but no online service can guarantee absolute security.",
          ],
        },
        {
          title: "6. International processing",
          paragraphs: [
            "Our providers may process information in countries other than your own. Where required, we use appropriate contractual or legal safeguards for international transfers.",
          ],
        },
        {
          title: "7. Your choices and rights",
          paragraphs: [
            `Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal information. To make a request, contact ${SUPPORT_EMAIL}. We may need to verify your identity before completing it.`,
          ],
        },
        {
          title: "8. Children",
          paragraphs: [
            "VibeGuide is not directed to children under 16, and we do not knowingly collect personal information from children under 16. Contact us if you believe a child has provided information to the service.",
          ],
        },
        {
          title: "9. Changes and contact",
          paragraphs: [
            `We may update this policy as the service changes. We will publish the updated version here and revise the date above. Questions or privacy requests can be sent to ${SUPPORT_EMAIL}.`,
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      updatedLabel: "Last updated",
      updatedAt: "July 16, 2026",
      introduction:
        "These Terms govern your use of VibeGuide, an AI-assisted development documentation service operated by Arakai in Shenzhen, Guangdong, China. By accessing or using VibeGuide, you agree to these Terms.",
      sections: [
        {
          title: "1. The service",
          paragraphs: [
            "VibeGuide helps users analyse project requirements and generate development documents, including user journeys, product requirements, frontend designs, backend designs, and database designs. Features may change as the service develops.",
            "AI-generated output may be incomplete, inaccurate, or unsuitable for your particular use. You are responsible for reviewing and testing all output before relying on it in a product, business, or technical decision.",
          ],
        },
        {
          title: "2. Accounts",
          paragraphs: [
            "You must provide accurate information, keep your login credentials secure, and promptly notify us of suspected unauthorised access. You are responsible for activity performed through your account. You must be legally capable of entering into these Terms.",
          ],
        },
        {
          title: "3. Project credits",
          paragraphs: [
            "VibeGuide uses project credits. One credit is charged when a complete project document set is generated. Available credit packages and prices are displayed on the pricing page before purchase. Credits have no cash value, cannot be transferred between accounts, and are not a bank account or stored-value financial product.",
            "If generation fails before a complete document set is delivered, the service is designed to return the charged credit. Contact support if an automatic return does not occur.",
          ],
        },
        {
          title: "4. Payments and refunds",
          paragraphs: [
            `International purchases may be processed by Creem as merchant of record. Chinese checkout purchases may be processed through ZPay and Alipay. Prices, taxes, currencies, and payment terms are shown at checkout. For billing or refund help, email ${SUPPORT_EMAIL} with your account email and order information. We aim to respond within three business days.`,
            "Refund eligibility is assessed under applicable law, the relevant payment provider's buyer terms, whether credits have been used, and whether the service was delivered. Used credits and successfully generated document sets are generally non-refundable unless required by law or we confirm a service failure. Nothing in these Terms limits mandatory consumer rights.",
          ],
        },
        {
          title: "5. Acceptable use",
          bullets: [
            "Do not use VibeGuide for unlawful, fraudulent, harmful, deceptive, or abusive activities.",
            "Do not submit content that infringes privacy, intellectual-property, confidentiality, or other rights.",
            "Do not attempt to bypass security, access another user's account, disrupt the service, scrape it at unreasonable scale, or reverse engineer restricted parts of the service.",
            "Do not use generated output as a substitute for qualified legal, medical, financial, safety, or other regulated professional advice.",
          ],
        },
        {
          title: "6. Your content and intellectual property",
          paragraphs: [
            "You retain ownership of content you submit. You grant Arakai a limited licence to host, process, reproduce, and transmit that content only as necessary to provide, secure, and improve VibeGuide. You confirm that you have the rights needed to submit the content.",
            "VibeGuide's software, branding, interface, and original materials remain owned by Arakai or its licensors. Subject to these Terms, you may use generated documents for your own personal or commercial projects. Because AI output may be similar to output generated for others, exclusivity is not guaranteed.",
          ],
        },
        {
          title: "7. Availability, suspension, and termination",
          paragraphs: [
            "We may modify, suspend, or discontinue parts of the service for maintenance, security, legal, or operational reasons. We may restrict or terminate accounts that violate these Terms, create risk, or misuse the service. You may stop using VibeGuide at any time.",
          ],
        },
        {
          title: "8. Disclaimers and liability",
          paragraphs: [
            "The service is provided on an as-available basis to the extent permitted by law. We do not guarantee uninterrupted operation or that generated content will be error-free. To the maximum extent permitted by law, Arakai is not liable for indirect, incidental, special, consequential, or lost-profit damages arising from use of the service. Mandatory rights and liabilities that cannot legally be excluded remain unaffected.",
          ],
        },
        {
          title: "9. Governing terms and changes",
          paragraphs: [
            "These Terms are governed by the laws applicable to the operator in the People's Republic of China, without limiting any mandatory consumer protection that applies in your country. Payment-provider buyer terms may also apply to a purchase.",
            "We may update these Terms when the service or legal requirements change. The updated version will be published here with a revised date. Continued use after an update means you accept the revised Terms where permitted by law.",
          ],
        },
        {
          title: "10. Contact",
          paragraphs: [
            `VibeGuide is operated by Arakai in Shenzhen, Guangdong, China. For support, billing questions, complaints, or legal notices, contact ${SUPPORT_EMAIL}.`,
          ],
        },
      ],
    },
  },
  zh: {
    privacy: {
      title: "隐私政策",
      updatedLabel: "最后更新",
      updatedAt: "2026 年 7 月 16 日",
      introduction:
        "本隐私政策说明由 Arakai 在中国广东省深圳市运营的 VibeGuide，在您使用我们的网站及 AI 开发文档服务时，如何收集、使用、存储和共享信息。",
      sections: [
        {
          title: "1. 我们收集的信息",
          bullets: [
            "账户信息，包括邮箱地址、用户标识、身份验证记录和会话信息。",
            "项目内容，包括项目描述、需求回答、生成的文档，以及您主动提交的文件或信息。",
            "购买和交易信息，包括所选套餐、订单编号、支付状态及充入账户的点数。我们不会存储完整的银行卡资料。",
            "技术和使用信息，例如 IP 地址、浏览器和设备信息、访问页面、错误日志及交互事件。",
          ],
        },
        {
          title: "2. 我们如何使用信息",
          bullets: [
            "提供、维护、保护并改进 VibeGuide。",
            "验证用户身份，管理账户、项目及项目点数。",
            "处理项目内容并生成 AI 辅助开发文档。",
            "处理购买、预防欺诈、排查错误并提供客户支持。",
            "履行法律义务并执行我们的服务条款。",
          ],
        },
        {
          title: "3. 服务提供商与信息共享",
          paragraphs: [
            "我们仅在运营服务、履行法律义务、保护用户或完成交易所必需的范围内共享信息。我们不会出售您的个人信息。",
          ],
          bullets: [
            "Supabase 提供身份验证和数据库基础设施。",
            "DeepSeek 会处理项目描述和需求回答，以生成开发文档。请勿提交项目所不需要的机密信息、受监管信息或敏感个人信息。",
            "Vercel 提供应用托管、性能监控和分析服务。",
            "Creem 作为记录商户处理国际购买；ZPay 和支付宝支持中文结账流程。支付提供商会根据其各自的隐私条款处理支付信息。",
            "在法律要求或为保护合法权益与服务安全而合理必要时，我们可能向专业顾问、主管机关或其他相关方提供信息。",
          ],
        },
        {
          title: "4. Cookie 与类似技术",
          paragraphs: [
            "VibeGuide 使用必要的 Cookie 和本地存储来完成身份验证、安全保护、语言偏好和主题设置。我们可能使用分析技术了解服务性能和使用情况。您可以通过浏览器设置控制非必要 Cookie，但部分功能可能无法正常工作。",
          ],
        },
        {
          title: "5. 保存期限与安全",
          paragraphs: [
            "我们会在提供服务、履行法律和会计义务、解决争议及防止滥用所合理需要的期限内保存账户、项目和交易记录。我们采用合理的技术和管理措施保护信息，但任何在线服务都无法保证绝对安全。",
          ],
        },
        {
          title: "6. 跨境处理",
          paragraphs: [
            "我们的服务提供商可能在您所在国家或地区之外处理信息。在法律要求的情况下，我们会采用适当的合同或法律保障措施。",
          ],
        },
        {
          title: "7. 您的选择与权利",
          paragraphs: [
            `根据您所在地区，您可能有权访问、更正、删除、限制或反对处理部分个人信息。如需提出请求，请联系 ${SUPPORT_EMAIL}。处理请求前，我们可能需要验证您的身份。`,
          ],
        },
        {
          title: "8. 未成年人",
          paragraphs: [
            "VibeGuide 不面向 16 周岁以下未成年人，我们不会有意收集其个人信息。如果您认为未成年人向本服务提供了信息，请联系我们。",
          ],
        },
        {
          title: "9. 政策变更与联系方式",
          paragraphs: [
            `我们可能根据服务变化更新本政策，并在本页面公布新版本及更新日期。如有隐私问题或权利请求，请发送邮件至 ${SUPPORT_EMAIL}。`,
          ],
        },
      ],
    },
    terms: {
      title: "服务条款",
      updatedLabel: "最后更新",
      updatedAt: "2026 年 7 月 16 日",
      introduction:
        "本条款适用于您使用由 Arakai 在中国广东省深圳市运营的 AI 辅助开发文档服务 VibeGuide。访问或使用 VibeGuide，即表示您同意本条款。",
      sections: [
        {
          title: "1. 服务内容",
          paragraphs: [
            "VibeGuide 帮助用户分析项目需求并生成开发文档，包括用户旅程、产品需求、前端设计、后端设计和数据库设计。随着服务发展，具体功能可能发生变化。",
            "AI 生成内容可能不完整、不准确或不适合您的具体用途。在将生成内容用于产品、业务或技术决策之前，您有责任进行审核和测试。",
          ],
        },
        {
          title: "2. 账户",
          paragraphs: [
            "您应提供准确信息、妥善保管登录凭据，并在发现疑似未经授权访问时及时通知我们。您需要对通过自己账户进行的活动负责，并应具备同意本条款的法定能力。",
          ],
        },
        {
          title: "3. 项目点数",
          paragraphs: [
            "VibeGuide 使用项目点数。每成功生成一套完整项目文档扣除 1 个点数。可购买的点数套餐和价格会在付款前显示于价格页面。点数不具有现金价值、不可在账户间转让，也不属于银行账户或储值金融产品。",
            "如果在交付完整文档前生成失败，系统会尝试返还已扣除的点数。如未自动返还，请联系客服。",
          ],
        },
        {
          title: "4. 支付与退款",
          paragraphs: [
            `国际购买可能由 Creem 作为记录商户处理；中文结账购买可能由 ZPay 和支付宝处理。价格、税费、币种和支付条件会在结账时展示。如需账单或退款帮助，请将账户邮箱和订单信息发送至 ${SUPPORT_EMAIL}，我们会尽量在 3 个工作日内回复。`,
            "退款资格将根据适用法律、相应支付提供商的买方条款、点数是否已使用以及服务是否已交付综合判断。除法律另有要求或我们确认发生服务故障外，已使用点数及已成功生成的文档通常不予退款。本条款不会限制消费者依法享有的强制性权利。",
          ],
        },
        {
          title: "5. 可接受使用规则",
          bullets: [
            "不得将 VibeGuide 用于违法、欺诈、有害、欺骗或滥用行为。",
            "不得提交侵犯隐私权、知识产权、保密义务或其他权利的内容。",
            "不得绕过安全措施、访问他人账户、干扰服务、进行不合理规模的抓取，或对受限制的服务部分进行逆向工程。",
            "不得将生成内容替代合格的法律、医疗、金融、安全或其他受监管专业意见。",
          ],
        },
        {
          title: "6. 您的内容与知识产权",
          paragraphs: [
            "您保留对所提交内容的所有权。您授予 Arakai 一项有限许可，使其仅为提供、保护和改进 VibeGuide 而托管、处理、复制和传输这些内容。您确认自己有权提交相关内容。",
            "VibeGuide 的软件、品牌、界面及原创材料归 Arakai 或其许可方所有。在遵守本条款的前提下，您可以将生成的文档用于个人或商业项目。由于 AI 生成结果可能与为其他用户生成的结果相似，我们不保证其具有独占性。",
          ],
        },
        {
          title: "7. 服务可用性、暂停与终止",
          paragraphs: [
            "我们可能因维护、安全、法律或运营原因修改、暂停或停止部分服务。对于违反本条款、造成风险或滥用服务的账户，我们可能限制或终止其使用。您可以随时停止使用 VibeGuide。",
          ],
        },
        {
          title: "8. 免责声明与责任限制",
          paragraphs: [
            "在法律允许的范围内，本服务按实际可用状态提供。我们不保证服务不会中断，也不保证生成内容完全无误。在法律允许的最大范围内，Arakai 不对因使用本服务产生的间接、附带、特殊、后果性损失或利润损失承担责任。法律规定不得排除的权利和责任不受影响。",
          ],
        },
        {
          title: "9. 适用规则与条款变更",
          paragraphs: [
            "本条款适用中华人民共和国境内运营主体所适用的法律，但不会限制您所在国家或地区的强制性消费者保护。购买行为还可能适用支付提供商的买方条款。",
            "当服务或法律要求发生变化时，我们可能更新本条款，并在本页面公布新版本和更新日期。在法律允许的情况下，更新后继续使用服务即表示您接受修订后的条款。",
          ],
        },
        {
          title: "10. 联系我们",
          paragraphs: [
            `VibeGuide 由 Arakai 在中国广东省深圳市运营。如需客服、账单帮助、投诉或发送法律通知，请联系 ${SUPPORT_EMAIL}。`,
          ],
        },
      ],
    },
  },
};

export function getLegalContent(locale: AppLocale) {
  return content[locale];
}
