import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Admin from "./Admin";
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";
import Profile from "./Profile";
import Customer from "./Customer";
import { logOut, getLoggedUserInfo } from "../context/Session";
import { arrayBufferToBase64, getProfileImage } from "../util/Image";
import { Image } from "semantic-ui-react";

type ThisProps = {
  logoTitle: string;
  isAdmin: boolean;
};

type ThisState = {
  logoTitle: string;
  isAdmin: boolean;
  name: string;
  img: string;
};

interface imageInterface {
  name: string;
  data: {
    data: Buffer;
    contentType: string;
  };
}

export default class Navigator extends React.Component<ThisProps, ThisState> {
  constructor(props: ThisProps) {
    super(props);
    this.state = { ...props, img: "", name: "" };
  }

  componentDidMount() {
    getLoggedUserInfo()
      .then((user: any) => {
        this.setState({ name: user.name });
        getProfileImage(user._id)
          .then((image: imageInterface) => {
            console.log(image);
            this.setState({ img: arrayBufferToBase64(image.data.data) });
          })
          .catch((e: any) => {
            console.log(e);
          });
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  render(): JSX.Element {
    return (
      <div>
        <Navbar className="tightComponent" expanded={true} expand="sm" variant="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Container>
            <Navbar.Brand as={Link} to={Dashboard.path}>
              {this.state.logoTitle}
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to={Calendar.path}>
                <p>Calendar</p>
              </Nav.Link>
              <Nav.Link as={Link} to={Customer.path}>
                <p>Customer List</p>
              </Nav.Link>
              <Nav.Link as={Link} to={Profile.path}>
                <p>Profile</p>
              </Nav.Link>
              {this.state.isAdmin && (
                <Nav.Link as={Link} to={Admin.path}>
                  <p>Admin</p>
                </Nav.Link>
              )}
            </Nav>
            <Navbar.Brand>
              <Image href={Profile.path} src={"data:image/jpeg;base64," + this.state.img} avatar />
              {this.state.name}
            </Navbar.Brand>
            <Button
              variant="outline-dark"
              onClick={() => {
                resolve();
              }}
            >
              <p>Log Out</p>
            </Button>
          </Container>
        </Navbar>
      </div>
    );
  }
}

async function resolve() {
  await logOut();
  await window.location.reload();
}
