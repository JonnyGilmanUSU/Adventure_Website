import React from 'react';
import CreateBlogPost from '../../Components/Admin/CreateBlogPost/CreateBlogPost';
import styles from './AdminPage.module.scss';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
          <h1>Admin Dashboard</h1>
          <div className={styles.manageContainer}>
            <Link to="/admin/blog-posts" className={styles.manageBlogPosts}><h2>Manage Blog Posts</h2></Link>
            <Link className={styles.manageUsers}><h2>Manage Users</h2></Link>
          </div>
      </div>
    </div>
  )
}

export default Admin;