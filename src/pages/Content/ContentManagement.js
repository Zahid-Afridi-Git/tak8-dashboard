import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Eye, Image, FileText, Save, RefreshCw, Globe,
  Search, Tag, Calendar, User, Users, Car, Phone, MessageCircle,
  BarChart3, Camera, Video, File, ExternalLink, Copy, Check, X,
  Clock, Activity, TrendingUp, Star
} from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

// Local Storage Helper Functions
const CMS_STORAGE_KEY = 'tak8_cms_data';
const UPDATES_STORAGE_KEY = 'tak8_cms_updates';

const saveCMSData = (data) => localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
const loadCMSData = () => {
  const stored = localStorage.getItem(CMS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const saveUpdate = (update) => {
  const updates = getUpdates();
  updates.unshift({ ...update, id: Date.now(), timestamp: new Date().toISOString() });
  localStorage.setItem(UPDATES_STORAGE_KEY, JSON.stringify(updates.slice(0, 50)));
};

const getUpdates = () => {
  const stored = localStorage.getItem(UPDATES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('recent');

  // Default CMS Data
  const getDefaultCMSData = () => ({
    homepage: {
      id: 'homepage',
      lastModified: new Date().toISOString(),
      hero: {
        title: 'Drive Your Journey',
        subtitle: 'Leave the Rest to Us!',
        description: 'We have many types of cars that are ready for you to travel anywhere and anytime.',
        ctaText: 'Get In Touch',
        secondaryCtaText: 'Our Cars',
        backgroundImage: '/img/home_car.png',
        mobileImage: '/img/home_car_mob.png'
      },
      bookingForm: {
        title: 'Perth Car Rental | Hourly & Affordable Car Hire – TAK8',
        locations: ['East Perth', 'Crown Plaza', 'Perth Airport'],
        enabled: true
      },
      topCars: {
        title: 'Choose Your Suitable Car',
        subtitle: 'POPULAR CAR',
        description: 'We present popular cars that are rented by customers to maximize your comfort on long trips.',
        enabled: true
      },
      services: {
        title: 'Our Services',
        subtitle: 'We present many guarantees and advantages when you rent a car with us',
        items: [
          {
            title: 'Airport Service',
            description: 'We provide convenient airport pickup and drop-off services',
            image: '/img/service_1.png',
            order: 1
          },
          {
            title: 'Vehicle Rental',
            description: 'Wide selection of quality vehicles for any occasion',
            image: '/img/service_2.png',
            order: 2
          },
          {
            title: 'Special Discounts',
            description: 'Enjoy special rates for long-term rentals',
            image: '/img/service_3.png',
            order: 3
          }
        ]
      },
      whyChooseUs: {
        title: 'Why Choose Us ?',
        subtitle: 'We present many guarantees and advantages when you rent a car with us for your trip',
        items: [
          {
            title: 'Easy Rent',
            description: 'We provide easy and fast car rental services without disturbing your productivity.',
            icon: '/img/icon/rent.svg',
            order: 1
          },
          {
            title: 'Premium Quality',
            description: 'We provide quality cars with the best fleet and provide a clean, comfortable, classy experience.',
            icon: '/img/icon/quality.svg',
            order: 2
          },
          {
            title: 'Professional Agent',
            description: 'We have professional agents ready to guide you with any strong.',
            icon: '/img/icon/agent.svg',
            order: 3
          }
        ]
      },
      seoSettings: {
        title: 'Perth Car Rental | Hourly & Affordable Car Hire – TAK8',
        description: 'TAK8 offers flexible Perth car rental with hourly and long-term options. Enjoy simple booking, no hidden fees, and a wide range of vehicles.',
        keywords: 'Perth car rental, hourly car hire, affordable car rental, TAK8',
        ogTitle: 'Affordable Perth Car Rental – TAK8',
        ogDescription: 'Book your Perth car hire with TAK8. Choose hourly or long-term rentals and enjoy transparent pricing with no extra charges.',
        ogImage: '/img/logo.png'
      }
    },
    about: {
      id: 'about',
      lastModified: new Date().toISOString(),
      hero: {
        title: 'About TAK8 Car Rental',
        subtitle: 'Your premier choice for car rentals in East Perth, Western Australia',
        backgroundImage: '/img/about_banner_u.png'
      },
      intro: {
        title: 'About TAK8 Car Rental',
        content: 'Welcome to TAK8 Car Rental, your premier choice for car rentals in East Perth, Western Australia, and beyond. Founded with a commitment to providing unparalleled rental experiences, TAK8 is dedicated to serving the local community and travelers alike with top-notch service, reliability, and convenience.'
      },
      vision: {
        title: 'Our Vision',
        icon: '/img/icon/vision.svg',
        content: 'At TAK8 Car Rental, our vision is clear: to become the go-to destination for car rentals in East Perth and throughout Western Australia. We aim to set new standards of excellence in the industry by offering a wide selection of vehicles, transparent pricing, and exceptional customer service.'
      },
      mission: {
        title: 'Our Mission',
        icon: '/img/icon/mission.svg',
        content: 'TAK8 Car Rental is on a mission to make car rental simple, affordable, and enjoyable. Whether you\'re exploring the sights of Perth, embarking on a road trip across Western Australia, or in need of temporary transportation, we\'re here to meet your needs with professionalism and expertise.'
      },
      whyChoose: {
        title: 'Why Choose TAK8 Car Rental?',
        subtitle: 'Why Choose US',
        description: 'We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the advantages that you will get',
        backgroundImage: '/img/whychoose.png',
        items: [
          {
            title: 'Local Expertise',
            icon: '/img/icon/local.svg',
            description: 'As a locally owned and operated business, we understand the unique needs of our customers. Count on us for personalized service, insider tips, and recommendations to make the most of your journey.'
          },
          {
            title: 'Quality Fleet',
            icon: '/img/icon/quality.svg',
            description: 'We take pride in our well-maintained fleet of vehicles, ranging from compact cars to spacious SUVs and 7-seaters. Each vehicle is meticulously inspected and cleaned to ensure your safety and comfort on the road.'
          },
          {
            title: 'Convenience',
            icon: '/img/icon/convenience.svg',
            description: 'Located in the heart of WA East Perth, our rental office is easily accessible and conveniently situated for your convenience. Plus, enjoy flexible booking options, extended hours, and hassle-free returns to accommodate your busy schedule.'
          }
        ]
      },
      seoSettings: {
        title: 'About TAK8 | Perth Car Hire Experts',
        description: 'TAK8 is your trusted local partner for car rental in Perth. Count on our friendly team, quality vehicles, and a hassle-free booking experience every time.',
        keywords: 'TAK8 about, Perth car rental company, local car hire',
        ogTitle: 'Get to Know TAK8 – Perth Car Rental',
        ogDescription: 'Discover how TAK8 is changing car rental in Perth with flexible, fair, and customer-first service.',
        ogImage: '/img/about_banner_u.png'
      }
    },
    services: {
      id: 'services',
      lastModified: new Date().toISOString(),
      hero: {
        title: 'OUR Services',
        subtitle: 'TAK8, Just Make It!'
      },
      intro: {
        title: 'Services Offered by TAK8 Car Rental',
        description: 'We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the advantages that you will get'
      },
      vehicleRental: {
        title: 'Vehicle Rental Options',
        image: '/img/our_service_1.png',
        options: ['Compact Cars', 'Sedans', 'SUVs', '7 Seaters'],
        description: 'We take pride in our well-maintained fleet of vehicles, ranging from compact cars to spacious SUVs and 7-seaters. Each vehicle is meticulously inspected and cleaned to ensure your safety and comfort on the road.'
      },
      flexibleRental: {
        title: 'Flexible Rental Periods',
        image: '/img/our_service_2.png',
        description: 'Choose from a variety of rental periods to suit your needs, whether you need a vehicle for a few hours, a day, a week, two weeks, or longer. Enjoy competitive rates and flexible booking options for hassle-free rentals.'
      },
      discounts: {
        title: 'Special Discounts for Extended Rentals',
        image: '/img/our_service_3.png',
        benefits: [
          'Enjoy a cheaper rate for 7-day hires or longer.',
          'Savings with discounted rates on hires of 14 days or more.'
        ],
        description: 'These special rates are designed to provide exceptional value for customers planning longer stays or extended travel in East Perth and beyond.'
      },
      airportPickup: {
        title: 'Airport After Hour Pickup',
        image: '/img/our_service_4.png',
        description: 'Take advantage of our convenient airport after hours pickup available at Perth Airport. Save time and skip the lines by arranging for your rental vehicle to be waiting for you upon arrival.'
      },
      additionalServices: {
        title: 'Additional Services',
        image: '/img/our_service_5.png',
        services: ['Child seat rentals', 'GPS navigation systems', 'Insurance coverage'],
        description: 'Ensure the safety and comfort of your little ones with our child seat rental options. Never get lost with our optional GPS navigation systems, available for rent with your vehicle. Stay protected on the road with our comprehensive insurance options tailored to your needs.'
      },
      corporate: {
        title: 'Corporate and Business Rentals',
        image: '/img/our_service_6.png',
        description: 'We offer special corporate and business rental packages tailored to the unique requirements of your company. Streamline your business travel arrangements with our convenient booking process and dedicated account management services.'
      },
      seoSettings: {
        title: 'Flexible Car Hire Perth | Hourly & Long-Term Rental – TAK8',
        description: 'Hire a car in Perth by the hour, day, or week. Enjoy clear, affordable pricing and a hassle-free booking experience with TAK8.',
        keywords: 'Perth car hire services, flexible rental, hourly car rental',
        ogTitle: 'Hourly & Long-Term Car Hire – TAK8 Perth',
        ogDescription: 'TAK8 makes car hire in Perth easy and flexible. Choose from hourly, daily, or long-term rentals to fit your trip.',
        ogImage: '/img/service_banner.png'
      }
    },
    contact: {
      id: 'contact',
      lastModified: new Date().toISOString(),
      businessInfo: {
        name: 'TAK8 Car Rental',
        phone: '+61 8 6461 9477',
        email: 'info@tak8.com.au',
        address: 'East Perth, Western Australia',
        hours: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 5:00 PM\nSun: 10:00 AM - 4:00 PM'
      },
      seoSettings: {
        title: 'Contact TAK8 Perth Car Rental | Get in Touch',
        description: 'Contact TAK8 for your Perth car rental needs. Located in East Perth with flexible hours and friendly service.',
        keywords: 'contact TAK8, Perth car rental contact, East Perth',
        ogTitle: 'Contact TAK8 – Perth Car Rental',
        ogDescription: 'Get in touch with TAK8 for all your Perth car rental needs. Professional service and competitive rates.',
        ogImage: '/img/contact_banner.png'
      }
    },
    testimonials: {
      id: 'testimonials',
      lastModified: new Date().toISOString(),
      reviews: [
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 5,
          comment: "Excellent service! The car was clean and the staff was very professional.",
          status: "approved",
          date: "2024-01-15"
        },
        {
          id: 2,
          name: "Mike Chen",
          rating: 5,
          comment: "Great experience with TAK8. Will definitely rent again!",
          status: "pending",
          date: "2024-01-14"
        }
      ]
    },
    blog: {
      hero: {
        title: 'TRAVEL BLOG',
        subtitle: 'Discover Perth & Western Australia',
        description: 'Expert travel guides, car rental tips, and local insights to make your journey through Western Australia unforgettable.'
      },
      posts: [
        {
          id: 1,
          title: 'The Ultimate Perth Road Trip Guide: 7 Must-Visit Destinations',
          slug: 'ultimate-perth-road-trip-guide',
          excerpt: 'Discover the most scenic routes and hidden gems around Perth with our comprehensive road trip guide.',
          content: 'Planning Your Perth Road Trip Adventure\n\nPerth, the vibrant capital of Western Australia, serves as the perfect starting point for an unforgettable road trip to Australia. With our comprehensive guide, you\'ll discover hidden gems, scenic coastal drives, and unique destinations that showcase the natural beauty of Western Australia.\n\nSwan Valley Wine Route\n\nJust 25 minutes from Perth CBD, the Swan Valley offers a perfect day trip experience. The region is home to Western Australia\'s oldest wine region, featuring over 40 wineries, breweries, and distilleries. The Swan Valley Winery offers free tastings and cellar door experiences that provide an authentic taste of local wine culture.\n\nRottnest Island Ferry and Island Tour\n\nMake your way to Hillarys Boat Harbour for a traditional road trip to Rottnest Island begins with a scenic drive to the coast, then a short ferry ride to this pristine paradise. The island is home to the famous quokkas, pristine beaches, and crystal-clear waters perfect for snorkeling and swimming.\n\nMargaret River Region\n\nA 3-hour drive south of Perth leads to Australia\'s premier wine region, the Margaret River area combines world-class wineries with stunning coastal scenery, artisanal food producers, and unique wildlife experiences. The region offers over 120 cellar doors and numerous boutique accommodation options.\n\nPinnacles Desert via Cervantes\n\nNo drive journey north of Perth leads to one of Western Australia\'s most spectacular landscapes. The Pinnacles Desert features thousands of limestone pillars rising from golden sand, creating an otherworldly landscape that\'s particularly stunning during sunrise and sunset.\n\nFremantle Desert Landscape\n\nThe otherworldly landscape of the Pinnacles Desert can be combined with visits to local attractions, including coastal seafood experiences at Cervantes and unique geological formations.\n\nMargaret River Region\n\nA 3-hour drive south of Perth leads to Australia\'s premier wine region and regions. The Margaret River area combines world-class wineries with stunning coastal scenery, artisanal food producers, and unique wildlife experiences. Many visitors choose to extend their stay in the region to fully explore its diverse offerings.\n\nEssential Road Trip Tips\n\n• Book your rental car in advance, especially during peak seasons\n• Download offline maps or mobile coverage can be limited in remote areas\n• Pack plenty of water and snacks for longer journeys\n• Check weather conditions and road closures before departure\n• Consider fuel stops carefully - distances between towns can be significant\n\nChoose the perfect vehicle from TAK8 for your Western Australia adventure.\n\nBest Time to Visit\n\nWestern Australia\'s climate varies significantly across the state, but generally:\n• September-November and March-May offer the most comfortable temperatures\n• December-February can be quite hot, especially in inland areas\n• June-August brings cooler weather and occasional rain\n\nEach season offers unique experiences and photo opportunities.',
          featuredImage: '/img/blog/perth-road-trip.jpg',
          category: 'Travel',
          status: 'published',
          publishDate: '2024-03-15',
          author: 'TAK8 Editorial Team',
          readTime: '8 min read',
          tags: ['perth', 'road-trip', 'travel', 'western-australia']
        },
        {
          id: 2,
          title: 'Car Rental Tips for First-Time Visitors to Perth',
          slug: 'car-rental-tips-first-time-visitors',
          excerpt: 'Essential tips for first-time visitors renting a car in Perth. Learn about driving rules, parking, and the best routes.',
          content: 'Essential Car Rental Tips for Perth Visitors...',
          featuredImage: '/img/blog/car-rental-tips.jpg',
          category: 'Travel',
          status: 'published',
          publishDate: '2024-03-12',
          author: 'TAK8 Editorial Team',
          readTime: '5 min read',
          tags: ['car-rental', 'perth', 'tips', 'first-time']
        },
        {
          id: 3,
          title: 'Planning Your Perfect Rottnest Island Day Trip',
          slug: 'rottnest-island-day-trip',
          excerpt: 'Make the most of your Rottnest Island adventure with our complete guide to planning the perfect day trip.',
          content: 'Complete guide to Rottnest Island...',
          featuredImage: '/img/blog/rottnest-island.jpg',
          category: 'Travel',
          status: 'published',
          publishDate: '2024-03-10',
          author: 'TAK8 Editorial Team',
          readTime: '6 min read',
          tags: ['rottnest-island', 'day-trip', 'perth', 'adventure']
        }
      ]
    },
    seo: {
      pages: [
        {
          id: 1, page: 'Homepage', url: '/',
          title: 'Perth Car Rental | Hourly & Affordable Car Hire – TAK8',
          description: 'TAK8 offers flexible Perth car rental with hourly and long-term options. Enjoy simple booking, no hidden fees, and a wide range of vehicles.',
          keywords: 'Perth car rental, hourly car hire, affordable car rental, TAK8',
          ogTitle: 'Affordable Perth Car Rental – TAK8',
          ogDescription: 'Book your Perth car hire with TAK8. Choose hourly or long-term rentals and enjoy transparent pricing.',
          ogImage: '/img/logo.png',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 2, page: 'About Us', url: '/about-us',
          title: 'About TAK8 | Perth Car Hire Experts',
          description: 'TAK8 is your trusted local partner for car rental in Perth. Count on our friendly team, quality vehicles, and a hassle-free booking experience.',
          keywords: 'TAK8 about, Perth car rental company, local car hire',
          ogTitle: 'Get to Know TAK8 – Perth Car Rental',
          ogDescription: 'Discover how TAK8 is changing car rental in Perth with flexible, fair, and customer-first service.',
          ogImage: '/img/about_banner_u.png',
          lastUpdated: new Date().toISOString()
        }
      ]
    }
  });

  const [cmsData, setCmsData] = useState(() => {
    const saved = loadCMSData();
    return saved || getDefaultCMSData();
  });

  useEffect(() => {
    saveCMSData(cmsData);
  }, [cmsData]);

  const tabs = [
    { id: 'recent', label: 'Recent Updates', icon: Activity },
    { id: 'homepage', label: 'Homepage', icon: Globe },
    { id: 'about', label: 'About Us', icon: Users },
    { id: 'services', label: 'Services', icon: Car },
    { id: 'blog', label: 'Blog Management', icon: FileText },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'testimonials', label: 'Testimonials', icon: MessageCircle },
    { id: 'seo', label: 'SEO Settings', icon: Search }
  ];

  const updateCMSData = (section, data, updateType = 'Updated') => {
    setCmsData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data, lastModified: new Date().toISOString() }
    }));
    saveUpdate({ section, updateType, data: JSON.stringify(data), user: 'Admin User' });
  };

  // Recent Updates Component
  const RecentUpdates = () => {
    const updates = getUpdates();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent CMS Updates</h2>
            <p className="text-gray-600">Track all recent changes to your website content</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last 50 updates</span>
          </div>
        </div>

        {updates.length === 0 ? (
          <div className="card p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates yet</h3>
            <p className="text-gray-600">Start editing your content to see updates here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {update.updateType}
                      </span>
                      <h3 className="font-medium text-gray-900 capitalize">{update.section}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Updated by {update.user}</p>
                    <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                  </div>
                  <button 
                    className="p-1 text-gray-400 hover:text-green-600" 
                    title="Go to Section"
                    onClick={() => setActiveTab(update.section)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Blog Management Component
  const BlogEditor = () => {
    const [blogPosts, setBlogPosts] = useState(cmsData.blog.posts);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showPostEditor, setShowPostEditor] = useState(false);

    const handleCreatePost = () => {
      const newPost = {
        id: Date.now(),
        title: 'New Blog Post',
        slug: 'new-blog-post',
        excerpt: '',
        content: '',
        featuredImage: '',
        category: 'Travel',
        status: 'draft',
        publishDate: new Date().toISOString().split('T')[0],
        author: 'TAK8 Editorial Team',
        readTime: '5 min read',
        tags: []
      };
      setSelectedPost(newPost);
      setShowPostEditor(true);
    };

    const handleSavePost = (post) => {
      const updatedPosts = blogPosts.map(p => p.id === post.id ? post : p);
      if (!blogPosts.find(p => p.id === post.id)) {
        updatedPosts.push(post);
      }
      setBlogPosts(updatedPosts);
      updateCMSData('blog', { posts: updatedPosts }, 'Blog Post Updated');
      setShowPostEditor(false);
      setSelectedPost(null);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
            <p className="text-gray-600">Manage your travel blog posts and content</p>
          </div>
          <button onClick={handleCreatePost} className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            New Blog Post
          </button>
        </div>

        {/* Featured Post */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Post</h3>
          {blogPosts[0] && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img 
                  src={blogPosts[0].featuredImage || '/img/blog/placeholder.jpg'} 
                  alt={blogPosts[0].title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <span className="inline-block px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">
                  FEATURED
                </span>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">{blogPosts[0].title}</h4>
                <p className="text-gray-600">{blogPosts[0].excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{blogPosts[0].publishDate}</span>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <button className="btn-primary">Read Article</button>
              </div>
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={post.featuredImage || '/img/blog/placeholder.jpg'} 
                  alt={post.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4 space-y-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {post.category}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{post.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.publishDate}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {setSelectedPost(post); setShowPostEditor(true);}}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Post Editor Modal */}
        {showPostEditor && selectedPost && (
          <BlogPostEditor 
            post={selectedPost} 
            onSave={handleSavePost}
            onCancel={() => {setShowPostEditor(false); setSelectedPost(null);}}
          />
        )}
      </div>
    );
  };

  // Blog Post Editor Component
  const BlogPostEditor = ({ post, onSave, onCancel }) => {
    const [editedPost, setEditedPost] = useState(post);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {post.id ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <div className="flex space-x-3">
              <button onClick={onCancel} className="btn-secondary">Cancel</button>
              <button onClick={() => onSave(editedPost)} className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Post
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                  <input
                    type="text"
                    value={editedPost.title}
                    onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={editedPost.slug}
                    onChange={(e) => setEditedPost({...editedPost, slug: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  rows={3}
                  value={editedPost.excerpt}
                  onChange={(e) => setEditedPost({...editedPost, excerpt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={10}
                  value={editedPost.content}
                  onChange={(e) => setEditedPost({...editedPost, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={editedPost.category}
                    onChange={(e) => setEditedPost({...editedPost, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Car Rental Tips">Car Rental Tips</option>
                    <option value="Local Guides">Local Guides</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editedPost.status}
                    onChange={(e) => setEditedPost({...editedPost, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={editedPost.publishDate}
                    onChange={(e) => setEditedPost({...editedPost, publishDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // SEO Manager Component
  const SEOManager = () => {
    const [seoPages, setSeoPages] = useState(cmsData.seo.pages);
    const [selectedPage, setSelectedPage] = useState(null);

    const handleUpdateSEO = (pageId, updates) => {
      const updatedPages = seoPages.map(page => 
        page.id === pageId 
          ? { ...page, ...updates, lastUpdated: new Date().toISOString() }
          : page
      );
      setSeoPages(updatedPages);
      updateCMSData('seo', { pages: updatedPages }, 'SEO Settings Updated');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">SEO Settings</h2>
            <p className="text-gray-600">Manage search engine optimization for all pages</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>{seoPages.length} pages configured</span>
          </div>
        </div>

        <div className="grid gap-6">
          {seoPages.map((page) => (
            <div key={page.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{page.page}</h3>
                  <p className="text-sm text-gray-500">{page.url}</p>
                </div>
                <button 
                  onClick={() => setSelectedPage(selectedPage === page.id ? null : page.id)}
                  className="btn-secondary text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {selectedPage === page.id ? 'Close' : 'Edit'}
                </button>
              </div>
              
              {selectedPage === page.id && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => handleUpdateSEO(page.id, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">{page.title.length}/60 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                      <input
                        type="text"
                        value={page.keywords}
                        onChange={(e) => handleUpdateSEO(page.id, { keywords: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={page.description}
                      onChange={(e) => handleUpdateSEO(page.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{page.description.length}/160 characters</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                      <input
                        type="text"
                        value={page.ogTitle}
                        onChange={(e) => handleUpdateSEO(page.id, { ogTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                      <input
                        type="text"
                        value={page.ogImage}
                        onChange={(e) => handleUpdateSEO(page.id, { ogImage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                    <textarea
                      rows={2}
                      value={page.ogDescription}
                      onChange={(e) => handleUpdateSEO(page.id, { ogDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Homepage Editor Component
  const HomepageEditor = () => {
    const [homepageData, setHomepageData] = useState(cmsData.homepage || {
      hero: { title: '', subtitle: '', description: '' },
      bookingForm: { locations: [] },
      whyChooseUs: { title: '', items: [] }
    });
    
    const handleSave = () => {
      updateCMSData('homepage', homepageData, 'Homepage Updated');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Homepage Content</h2>
            <p className="text-gray-600">Manage your homepage sections and content</p>
          </div>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>

        {/* Hero Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
                <input
                  type="text"
                  value={homepageData.hero?.title || ''}
                  onChange={(e) => setHomepageData({...homepageData, hero: {...(homepageData.hero || {}), title: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={homepageData.hero?.subtitle || ''}
                  onChange={(e) => setHomepageData({...homepageData, hero: {...(homepageData.hero || {}), subtitle: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={homepageData.hero?.description || ''}
                  onChange={(e) => setHomepageData({...homepageData, hero: {...(homepageData.hero || {}), description: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                <ImageUpload onImageUpload={(url) => setHomepageData({...homepageData, hero: {...(homepageData.hero || {}), backgroundImage: url}})} />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Form</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Locations</label>
              <div className="space-y-2">
                {(homepageData.bookingForm?.locations || []).map((location, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        const newLocations = [...(homepageData.bookingForm?.locations || [])];
                        newLocations[index] = e.target.value;
                        setHomepageData({...homepageData, bookingForm: {...(homepageData.bookingForm || {}), locations: newLocations}});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <button 
                      onClick={() => {
                        const newLocations = (homepageData.bookingForm?.locations || []).filter((_, i) => i !== index);
                        setHomepageData({...homepageData, bookingForm: {...(homepageData.bookingForm || {}), locations: newLocations}});
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newLocations = [...(homepageData.bookingForm?.locations || []), 'New Location'];
                    setHomepageData({...homepageData, bookingForm: {...(homepageData.bookingForm || {}), locations: newLocations}});
                  }}
                  className="btn-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={homepageData.whyChooseUs?.title || ''}
                onChange={(e) => setHomepageData({...homepageData, whyChooseUs: {...(homepageData.whyChooseUs || {}), title: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-4">
              {(homepageData.whyChooseUs?.items || []).map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={item?.title || ''}
                        onChange={(e) => {
                          const newItems = [...(homepageData.whyChooseUs?.items || [])];
                          newItems[index] = {...(newItems[index] || {}), title: e.target.value};
                          setHomepageData({...homepageData, whyChooseUs: {...(homepageData.whyChooseUs || {}), items: newItems}});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={2}
                        value={item?.description || ''}
                        onChange={(e) => {
                          const newItems = [...(homepageData.whyChooseUs?.items || [])];
                          newItems[index] = {...(newItems[index] || {}), description: e.target.value};
                          setHomepageData({...homepageData, whyChooseUs: {...(homepageData.whyChooseUs || {}), items: newItems}});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // About Editor Component
  const AboutEditor = () => {
    const [aboutData, setAboutData] = useState(cmsData.about || {
      hero: { title: '', subtitle: '', backgroundImage: '' },
      intro: { title: '', content: '' },
      vision: { title: '', icon: '', content: '' },
      mission: { title: '', icon: '', content: '' },
      whyChoose: { title: '', subtitle: '', description: '', items: [] }
    });
    
    const handleSave = () => {
      updateCMSData('about', aboutData, 'About Page Updated');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">About Us Content</h2>
            <p className="text-gray-600">Manage your about page sections</p>
          </div>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>

        {/* Hero Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={aboutData.hero.title}
                  onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, title: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <textarea
                  rows={2}
                  value={aboutData.hero.subtitle}
                  onChange={(e) => setAboutData({...aboutData, hero: {...aboutData.hero, subtitle: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <ImageUpload onImageUpload={(url) => setAboutData({...aboutData, hero: {...aboutData.hero, backgroundImage: url}})} />
            </div>
          </div>
        </div>

        {/* Company Introduction */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Introduction</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={aboutData.intro.title}
                onChange={(e) => setAboutData({...aboutData, intro: {...aboutData.intro, title: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                rows={4}
                value={aboutData.intro.content}
                onChange={(e) => setAboutData({...aboutData, intro: {...aboutData.intro, content: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Services Editor Component  
  const ServicesEditor = () => {
    const [servicesData, setServicesData] = useState(cmsData.services || {
      hero: { title: '', subtitle: '' },
      intro: { title: '', description: '' },
      vehicleRental: { title: '', image: '', description: '', options: [] }
    });
    
    const handleSave = () => {
      updateCMSData('services', servicesData, 'Services Page Updated');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Services Content</h2>
            <p className="text-gray-600">Manage your services page sections</p>
          </div>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>

        {/* Hero Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Header</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={servicesData.hero?.title || ''}
                onChange={(e) => setServicesData({...servicesData, hero: {...(servicesData.hero || {}), title: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={servicesData.hero?.subtitle || ''}
                onChange={(e) => setServicesData({...servicesData, hero: {...(servicesData.hero || {}), subtitle: e.target.value}})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Sections</h3>
          <div className="space-y-6">
            {/* Vehicle Rental */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Vehicle Rental Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={servicesData.vehicleRental?.title || ''}
                    onChange={(e) => setServicesData({...servicesData, vehicleRental: {...(servicesData.vehicleRental || {}), title: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
                  <ImageUpload onImageUpload={(url) => setServicesData({...servicesData, vehicleRental: {...(servicesData.vehicleRental || {}), image: url}})} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={servicesData.vehicleRental?.description || ''}
                  onChange={(e) => setServicesData({...servicesData, vehicleRental: {...(servicesData.vehicleRental || {}), description: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contact Editor Component
  const ContactEditor = () => {
    const [contactData, setContactData] = useState(cmsData.contact || {
      businessInfo: { name: '', phone: '', email: '', address: '', hours: '' }
    });
    
    const handleSave = () => {
      updateCMSData('contact', contactData, 'Contact Page Updated');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Page</h2>
            <p className="text-gray-600">Manage contact information and form settings</p>
          </div>
          <button onClick={handleSave} className="btn-primary">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>

        {/* Business Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={contactData.businessInfo?.name || ''}
                  onChange={(e) => setContactData({...contactData, businessInfo: {...(contactData.businessInfo || {}), name: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={contactData.businessInfo?.phone || ''}
                  onChange={(e) => setContactData({...contactData, businessInfo: {...(contactData.businessInfo || {}), phone: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={contactData.businessInfo?.email || ''}
                  onChange={(e) => setContactData({...contactData, businessInfo: {...(contactData.businessInfo || {}), email: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  rows={3}
                  value={contactData.businessInfo?.address || ''}
                  onChange={(e) => setContactData({...contactData, businessInfo: {...(contactData.businessInfo || {}), address: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                <textarea
                  rows={3}
                  value={contactData.businessInfo?.hours || ''}
                  onChange={(e) => setContactData({...contactData, businessInfo: {...(contactData.businessInfo || {}), hours: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Media Library Component
  const MediaLibrary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-600">Manage your website images and files</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Upload Media
        </button>
      </div>
      <div className="card p-6">
        <ImageUpload onImageUpload={(url) => console.log('Media uploaded:', url)} />
      </div>
    </div>
  );

  // Testimonials Editor Component
  const TestimonialsEditor = () => {
    const [testimonialsData, setTestimonialsData] = useState(cmsData.testimonials || {
      reviews: []
    });
    
    const handleSave = () => {
      updateCMSData('testimonials', testimonialsData, 'Testimonials Updated');
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Testimonials</h2>
            <p className="text-gray-600">Manage customer reviews and testimonials</p>
          </div>
          <button onClick={handleSave} className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Add Testimonial
          </button>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {testimonialsData.reviews.map((testimonial) => (
            <div key={testimonial.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      testimonial.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {testimonial.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{testimonial.comment}</p>
                  <p className="text-sm text-gray-500">Submitted: {testimonial.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Approve">
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded" title="Edit">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recent': return <RecentUpdates />;
      case 'homepage': return <HomepageEditor />;
      case 'about': return <AboutEditor />;
      case 'services': return <ServicesEditor />;
      case 'blog': return <BlogEditor />;
      case 'contact': return <ContactEditor />;
      case 'media': return <MediaLibrary />;
      case 'testimonials': return <TestimonialsEditor />;
      case 'seo': return <SEOManager />;
      default: return <RecentUpdates />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Content Management</h1>
          <p className="mt-2 text-gray-600">Manage all your website content with local storage</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <RefreshCw className="h-5 w-5 mr-2" />
            Sync Changes
          </button>
          <button className="btn-primary">
            <Eye className="h-5 w-5 mr-2" />
            Preview Website
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ContentManagement; 