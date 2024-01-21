import {
    CCardBody, CCard, CCardTitle, CCardHeader,
    CAccordion, CAccordionBody, CAccordionItem, CAccordionHeader
} from '@coreui/react'
import React from 'react'

const companyPolicy = () => {

    const [companyPolicy, setCompanyPolicy] = React.useState([
        {
            id: 1,
            title: "Employee Code of Conduct",
            description: "All employees are expected to adhere to the code of conduct, maintaining professionalism and ethical behavior in all interactions within and outside the organization."
        },
        {
            id: 2,
            title: "Data Security Policy",
            description: "This policy outlines the procedures and responsibilities for safeguarding sensitive company and client information. All employees must follow these protocols to ensure data security."
        },
        {
            id: 3,
            title: "Workplace Health & Safety",
            description: "Ensuring a safe working environment is a priority. This policy details safety measures, emergency procedures, and guidelines for preventing workplace hazards."
        },
        {
            id: 4,
            title: "Leave and Time-off Policy",
            description: "This policy describes the procedures for requesting and managing leaves, including vacation, sick days, and other time-off benefits available to employees."
        },
        {
            id: 5,
            title: "Diversity and Inclusion Policy",
            description: "We promote diversity and inclusivity within our workplace. This policy emphasizes our commitment to providing equal opportunities and fostering a diverse and inclusive culture."
        },
        {
            id: 6,
            title: "Anti-Harassment Policy",
            description: "Our company has a zero-tolerance policy against harassment of any kind. This policy ensures a respectful and harassment-free workplace for all employees."
        },
        {
            id: 7,
            title: "Performance Appraisal Policy",
            description: "This policy outlines the procedures and criteria used for employee performance evaluations. It includes performance review schedules and feedback mechanisms."
        },
        {
            id: 8,
            title: "Remote Work Policy",
            description: "In response to changing work dynamics, this policy defines guidelines and expectations for employees working remotely, including communication protocols and equipment use."
        },
        {
            id: 9,
            title: "Training and Development Policy",
            description: "We encourage continuous learning and skill development. This policy describes the company's support for employee training programs and professional growth opportunities."
        },
        {
            id: 10,
            title: "Expense Reimbursement Policy",
            description: "This policy outlines the procedures for employees to claim reimbursements for business-related expenses, including submission guidelines and approval processes."
        },
        {
            id: 11,
            title: "Code of Ethics",
            description: "Our company's code of ethics outlines the values and principles that guide our decisions, actions, and interactions with clients, partners, and stakeholders."
        },
        {
            id: 12,
            title: "Conflict of Interest Policy",
            description: "To maintain integrity, this policy identifies and manages situations where employees' personal interests conflict with the company's interests or duties."
        },
        {
            id: 13,
            title: "Social Media Policy",
            description: "This policy provides guidelines on the appropriate use of social media by employees to protect the company's reputation and maintain professionalism."
        },
        {
            id: 14,
            title: "Business Travel Policy",
            description: "This policy outlines procedures and guidelines for employees traveling on company business, including booking, expenses, and safety measures."
        },
        {
            id: 15,
            title: "Environmental Sustainability Policy",
            description: "Our commitment to sustainability is reflected in this policy, which outlines our efforts to minimize environmental impact and promote eco-friendly practices."
        },
        {
            id: 16,
            title: "Employee Grievance Policy",
            description: "This policy establishes a fair and transparent procedure for employees to raise and resolve grievances related to work, management, or colleagues."
        },
        {
            id: 17,
            title: "Flexible Work Hours Policy",
            description: "We offer flexibility in work hours to support employees' work-life balance. This policy details guidelines and procedures for flexible scheduling."
        },
        {
            id: 18,
            title: "Drug and Alcohol Policy",
            description: "To ensure a safe and productive workplace, this policy defines rules and consequences regarding the use of drugs and alcohol during work hours."
        },
        {
            id: 19,
            title: "Telecommuting Policy",
            description: "This policy provides guidelines for employees working from home or other remote locations, including expectations and communication protocols."
        },
        {
            id: 20,
            title: "Email and Communication Policy",
            description: "Guidelines for the proper use of company email and communication channels, ensuring professionalism, security, and compliance with regulations."
        },
    ]); // This is dummy data, replace it with actual data from API

    return (
        <>
            <CCard style={{
                backgroundColor: '#f5f5f5', // Adding background color here
                border: 'none',
            }}>
                <CAccordion
                    flush
                    style={{
                        border: 'none',
                        boxShadow: 'none',
                    }}
                >
                    {
                        companyPolicy.map(policy => (
                            <CAccordionItem
                                key={policy.id}
                                style={{
                                    border: 'none',
                                    boxShadow: 'none',
                                    backgroundColor: '#f5f5f5', // Adding background color here
                                }}
                            >
                                <CAccordionHeader>{policy.title}</CAccordionHeader>
                                <CAccordionBody                >
                                    <p>{policy.description}</p>
                                </CAccordionBody>
                            </CAccordionItem>
                        ))
                    }
                </CAccordion>
            </CCard>

        </>
    );
}

export default companyPolicy;