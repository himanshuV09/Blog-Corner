import { useHistory, useParams } from "react-router-dom";
import useFetch from "./useFetch";
import { useState } from "react";

const BlogDetails = () => {
    const { id } = useParams();
    const { data: blog, error, isPending } = useFetch(`http://localhost:8000/blogs/${id}`);
    const history = useHistory();
    const [changeset, setChangeState] = useState(false);
    const [bodys, setBodys] = useState('');
    const [cnt,setcnt] =useState(1);
    //Initialize body with fetched content
    if (blog && bodys === '' && cnt<=1) {
        setBodys(blog.body);  
        setcnt(2)//Directly set the body state
    }

    const handleClickdel = () => {
        fetch('http://localhost:8000/blogs/' + blog.id, {
            method: 'DELETE'
        }).then(() => {
            history.push('/');
        }).catch(err => {
            console.error("Error deleting the blog:", err);
        });
    };

    const handleClickupd = () => {
        fetch('http://localhost:8000/blogs/' + blog.id, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: blog.title,
                body: bodys, //Updated content
                author: blog.author
            })
        }).then(() => {
            //After updating, refetch the blog data to get the updated content
            return fetch('http://localhost:8000/blogs/' + blog.id);
        }).then(response => response.json())
          .then(updatedBlog => {
              setBodys(updatedBlog.body); //Use updated content from server
              setChangeState(false);
          })
          .catch(err => {
              console.error("Error updating the blog:", err);
          });
    };

    const changesetfunc = () => {
        setChangeState(true);
    };

    return (
        <div className="blog-details">
            {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {blog && (
                <article>
                    <h2>{blog.title}</h2>
                    <p>Written by {blog.author}</p>
                    {changeset===false && <div>{bodys}</div>} {/* Ensure this displays the current content */}
                    <button onClick={handleClickdel}>Delete</button>
                    {!changeset ? (
                        <button onClick={changesetfunc} style={{ margin: '10px'} }>Update</button>
                    ) : (
                        <div>
                            <textarea
                                required
                                value={bodys}
                                onChange={(e) => setBodys(e.target.value)}
                            />
                            <button onClick={handleClickupd}>Save Changes</button>
                        </div>
                    )}
                </article>
            )}
        </div>
    );
}

export default BlogDetails;
