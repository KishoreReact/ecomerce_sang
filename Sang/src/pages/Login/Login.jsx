import './Login.css'
import { Col, Container, Row } from "react-bootstrap";
import LoginForm from "./LoginForm/LoginForm";
import RegisterForm from "./LoginForm/RegisterForm";

function Login(){
  return (
    <div>
      <Container className={"fullContainer"}>
        <Row>
          <Col className='Col-Login'>
            <LoginForm />
            
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login