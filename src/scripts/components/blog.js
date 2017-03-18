import React from 'react';

export default class Blog extends React.Component {
	constructor() {
			super()
			this.state = {
				posts: []
			}
		}
		componentDidMount() {
			firebase.database().ref().on('value', (res) => {
				const userData = res.val();
				const dataArray = [];
				for(let objKey in userData) {
					userData[objKey].key = objKey;
					dataArray.push(userData[objKey])
				}
				this.setState({
					posts: dataArray
				})
			});
		}
	render() {
		return (
			<div>
			<h1>Welcome to my blog</h1>
			<ul>
					{this.state.posts.map((item) => {
						return <BlogPost data={item} key={item.key} removePost={this.removePost}/>
					})}
				</ul>
			</div>
		)
	}
}

function BlogPost(props) {
	return (
		<div>
				<li>
					<h1>{props.data.title}</h1>
					<p>{props.data.content}</p>
					<Link to={`/blog/${props.data.key}`}>View Post</Link>
				</li>
		</div>
	)
}