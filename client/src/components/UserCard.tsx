import React from "react";
import { Card, Image, Loader } from "semantic-ui-react";
import { arrayBufferToBase64, getProfileImage } from "../util/Image";

interface IUserCardState {
  isloading: boolean;
  img: string;
}

interface IUserCardProps {
  _id: string;
  name: string;
  message: string;
}

interface imageInterface {
  name: string;
  data: {
    data: Buffer;
    contentType: string;
  };
}
export default class UserCard extends React.Component<IUserCardProps, IUserCardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isloading: true,
      img: "",
    };
  }

  componentDidMount() {
    this.setState({ isloading: true });
    getProfileImage(this.props._id)
      .then((image: imageInterface) => {
        console.log(image);
        this.setState({ img: arrayBufferToBase64(image.data.data), isloading: false });
      })
      .catch((e: any) => {
        console.log(e);
        this.setState({ isloading: false });
      });
  }

  render(): JSX.Element {
    if (this.state.isloading) {
      return <Loader active />;
    }
    return (
      <Card centered>
        <Image src={"data:image/jpeg;base64," + this.state.img} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{"Hello " + this.props.name} </Card.Header>
          <Card.Description>{this.props.message}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
