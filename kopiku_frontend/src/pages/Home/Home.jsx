import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import MenuItem from '../../components/MenuItem/MenuItem';
import tumblerImg from '../../assets/images/black (2).jpg';
import coffeeBeans from '../../assets/images/coffee-beans.jpg';
import kopiMug from '../../assets/images/mug.jpg';

const Home = () => {
  const featuredItems = [
    {
      id: 1,
      name: 'Blvck Tumbler',
      description: 'Tumbler Yang Sangat Kalcer  Buat Nemenin Kalian Ngopi dengan Kalcer',
      image: tumblerImg,
      price: 250000,
      category: 'merchandise'
    },
    {
      id: 2,
      name: 'Coffee Beans Premium',
      description: 'Biji kopi pilihan dengan aroma khas dan rasa yang kuat, cocok untuk penggemar kopi sejati',
      image: coffeeBeans,
      price: 120000,
      category: 'merchandise'
    },
    {
      id: 3,
      name: 'Kopiku Mug',
      description: 'Mug keramik berkualitas tinggi dengan desain elegan, cocok untuk menikmati kopi di rumah',
      image: kopiMug,
      price: 85000,
      category: 'merchandise'
    }
  ];

  const categories = [
    {
      id: 'non-coffee',
      title: 'Non-Coffee',
      description: 'Buat Kalian Yang Gak Suka Kopi, Non Coffee Juga Gak Kalah Enak Kok',
      link: '/menu/non-coffee',
      buttonText: 'Lihat Menu'
    },
    {
      id: 'food',
      title: 'Snack',
      description: 'Buat Ganjel Laper Ini Bisa Banget, Dan Yang Pasti Enak-Enak Banget',
      link: '/menu/snack',
      buttonText: 'Food Menu'
    },
    {
      id: 'coffee',
      title: 'Coffee',
      description: 'Kopi Buat Kalian Yang Suka Kopi, Kopi Disini Recomended Banget',
      link: '/menu/coffee',
      buttonText: 'Discover More'
    },
    {
      id: 'coffe',
      title: 'Tea',
      description: 'Wah Ini Sih Cocok Banget Buat Kalian Yang Mau Nge-Teh Santai, Untuk Kualitas Gak Usah Ditanya',
      link: '/menu/tea',
      buttonText: 'Discover More'
    }
    
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>KOPIKU </h1>
          <h2>Tempat Ngopi Yang Sangat Nyaman</h2>
          <p>KopiKu Hadir Sebagai Tempat Ngopi Yang Sangat Nyaman Dan Menyajikan Berbagai Macam Menu Yang Siap Menemani Anda</p>
          {/* Mengubah link dari /menu/coffee menjadi /menu */}
          <Link to="/menu" className="btn-primary">Explore Menu</Link>
        </div>
      </section>

      <section className="featured-items">
        <h2>Item Unggulan </h2>
        <div className="items-grid">
          {featuredItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-header">
          <h2>Menu KopiKu</h2>
          <p>KopiKu Hadir Dengan Berbagai Menu Yang Pastinya Enakkk Bangett!</p>
        </div>
        
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <Link to={category.link} className="btn-secondary">{category.buttonText}</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
