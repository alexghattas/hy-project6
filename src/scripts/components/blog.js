import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';
import BlogNav from './blognav.js';

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
				<BlogNav />
				<section className="blogPage__hero">
					<h1>Welcome to My Blog</h1>
					<h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h4>
				</section>
				<div className="wrapper">
					<ul className="blogPage__postContainer">
						{this.state.posts.map((item) => {
							return <BlogPost data={item} key={item.key} removePost={this.removePost}/>
						})}
					</ul>
				</div>
			</div>
		)
	}
}

function BlogPost(props) {
	return (
		<li className="blogPage__postContainer--list">
			<div className="blogPage__singlePost--image" style={{
							backgroundImage: 'url(' + props.data.photo + ')',
							backgroundSize: 'cover',
							backgroundPosition: 'center center'
						}}>
			</div>
			<h2>{props.data.title}</h2>
			<Link className="blogPost__button" to={`/blog/${props.data.key}`}>View Post</Link>
		</li>
	)
}