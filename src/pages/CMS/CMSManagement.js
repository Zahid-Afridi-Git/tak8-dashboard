import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Eye, Save, X, Upload, Image, FileText, Settings,
  Monitor, Smartphone, Tablet, Search, Tag, Calendar, User, BarChart3,
  Globe, MapPin, Phone, Mail, Clock, Star, CheckCircle, AlertCircle,
  Copy, ExternalLink, Zap, Car, Home, Info, Briefcase, MessageSquare
} from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

const CMSManagement = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // CMS Data Structure matching the actual website
  const [cmsData, setCmsData] = useState({
    homepage: {
      id: 1,
      lastModified: '2024-01-15T10:30:00Z',
      isActive: true,
      bookingForm: {
        title: 'Perth Car Rental | Hourly & Affordable Car Hire – TAK8',
        pickupLocations: ['East Perth', 'Crown Plaza', 'Perth Airport'],
        dropoffLocations: ['East Perth', 'Crown Plaza', 'Perth Airport'],
        enabled: true
      },
      heroSection: {
        title: 'Drive Your Journey',
        subtitle: 'Leave the Rest to Us!',
        description: 'We have many types of cars that are ready for you to travel anywhere and anytime.',
        primaryButtonText: 'Get In Touch',
        primaryButtonLink: '/contact',
        secondaryButtonText: 'Our Cars',
        secondaryButtonLink: '/cars',
        backgroundImage: '/img/home_car.png',
        carImage: '/img/home_car.png'
      },
      carShowcase: {
        title: 'Choose Your Suitable Car',
        subtitle: 'POPULAR CAR',
        description: 'We present popular cars that are rented by customers to maximize your comfort on long trips.',
        enabled: true
      },
      servicesSection: {
        title: 'Our Services',
        subtitle: 'Our service is not only renting a car, but we also provide a private chauffeur service that will guide you',
        services: [
          {
            title: 'Perth Airport Service',
            description: 'We provide airport pickup and drop-off services for your convenience.',
            image: '/img/our_service_1.png',
            buttonText: 'Read More',
            buttonLink: '/services',
            order: 1
          },
          {
            title: 'Vehicle Rental Services',
            description: 'Choose from our wide range of vehicles for all your transportation needs.',
            image: '/img/our_service_2.png',
            buttonText: 'Read More',
            buttonLink: '/services',
            order: 2
          },
          {
            title: 'Special Discounts for Extended Rentals',
            description: 'Enjoy great savings with our special rates for longer rental periods.',
            image: '/img/our_service_3.png',
            buttonText: 'Read More',
            buttonLink: '/services',
            order: 3
          }
        ],
        enabled: true
      },
      whyChooseUsSection: {
        title: 'Why Choose Us ?',
        subtitle: 'We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the advantages that you will get',
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
          },
          {
            title: 'Car Safety',
            description: 'We guarantee the safety of the engine of the car drivers coming with safe engines.',
            icon: '/img/icon/safety.svg',
            order: 4
          },
          {
            title: 'Refund',
            description: 'If you are not satisfied, we provide a money back opportunity.',
            icon: '/img/icon/refund.svg',
            order: 5
          },
          {
            title: 'Live Monitoring',
            description: 'Our drivers provide driver customer monitoring to monitor the level of safety and comfort.',
            icon: '/img/icon/live.svg',
            order: 6
          }
        ],
        enabled: true
      },
      testimonialsSection: {
        title: 'What Our Customers Say',
        subtitle: 'TESTIMONIALS',
        enabled: true
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
    aboutUs: {
      id: 2,
      lastModified: '2024-01-12T14:20:00Z',
      isActive: true,
      heroBanner: {
        title: 'ABOUT US',
        subtitle: '',
        backgroundImage: '/img/about_banner_u.png'
      },
      companyIntro: {
        title: 'About TAK8 Car Rental',
        content: 'Welcome to TAK8 Car Rental, your premier choice for car rentals in East Perth, Western Australia, and beyond. Founded with a commitment to providing unparalleled rental experiences, TAK8 is dedicated to serving the local community and travelers alike with top-notch service, reliability, and convenience.',
        image: '/img/about_banner_u.png'
      },
      visionMission: {
        visionTitle: 'Our Vision',
        visionContent: 'At TAK8 Car Rental, our vision is clear: to become the go-to destination for car rentals in East Perth and throughout Western Australia. We aim to set new standards of excellence in the industry by offering a wide selection of vehicles, transparent pricing, and exceptional customer service.',
        visionIcon: '/img/icon/vision.svg',
        missionTitle: 'Our Mission',
        missionContent: 'TAK8 Car Rental is on a mission to make car rental simple, affordable, and enjoyable. Whether you\'re exploring the sights of Perth, embarking on a road trip across Western Australia, or in need of temporary transportation, we\'re here to meet your needs with professionalism and expertise.',
        missionIcon: '/img/icon/mission.svg'
      },
      whyChooseSection: {
        title: 'Why Choose TAK8 Car Rental?',
        subtitle: 'WHY CHOOSE US',
        description: 'We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the advantages that you will get',
        backgroundImage: '/img/whychoose.png',
        items: [
          {
            title: 'Local Expertise',
            description: 'As a locally owned and operated business, we understand the unique needs of our customers. Count on us for personalized service, insider tips, and recommendations to make the most of your journey.',
            icon: '/img/icon/local.svg',
            order: 1
          },
          {
            title: 'Quality Fleet',
            description: 'We take pride in our well-maintained fleet of vehicles, ranging from compact cars to spacious SUVs and 7-seaters. Each vehicle is meticulously inspected and cleaned to ensure your safety and comfort on the road.',
            icon: '/img/icon/quality.svg',
            order: 2
          },
          {
            title: 'Convenience',
            description: 'Located in the heart of WA East Perth, our rental office is easily accessible and conveniently situated for your convenience. Plus, enjoy flexible booking options, extended hours, and hassle-free returns to accommodate your busy schedule.',
            icon: '/img/icon/convenience.svg',
            order: 3
          }
        ]
      },
      teamSection: {
        title: 'Meet Our Team',
        subtitle: 'OUR TEAM',
        members: [],
        enabled: false
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
      id: 3,
      lastModified: '2024-01-10T09:15:00Z',
      isActive: true,
      hero: {
        title: 'OUR SERVICES',
        subtitle: 'TAK8, Just Make It!',
        backgroundImage: '/img/service_banner.png'
      },
      intro: {
        title: 'Services Offered by TAK8 Car Rental',
        description: 'We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the advantages that you will get'
      },
      vehicleRental: {
        title: 'Vehicle Rental Options',
        description: 'We take pride in our well-maintained fleet of vehicles, ranging from compact cars to spacious SUVs and 7-seaters. Each vehicle is meticulously inspected and cleaned to ensure your safety and comfort on the road.',
        image: '/img/our_service_1.png',
        options: [
          { name: 'Compact Cars', enabled: true, order: 1 },
          { name: 'Sedans', enabled: true, order: 2 },
          { name: 'SUVs', enabled: true, order: 3 },
          { name: '7 Seaters', enabled: true, order: 4 }
        ]
      },
      flexibleRental: {
        title: 'Flexible Rental Periods',
        description: 'Choose from a variety of rental periods to suit your needs, whether you need a vehicle for a few hours, a day, a week, two weeks, or longer. Enjoy competitive rates and flexible booking options for hassle-free rentals.',
        image: '/img/our_service_2.png'
      },
      specialDiscounts: {
        title: 'Special Discounts for Extended Rentals',
        description: 'These special rates are designed to provide exceptional value for customers planning longer stays or extended travel in East Perth and beyond.',
        image: '/img/our_service_3.png',
        benefits: [
          { text: 'Enjoy a cheaper rate for 7-day hires or longer.', order: 1 },
          { text: 'Savings with discounted rates on hires of 14 days or more.', order: 2 }
        ]
      },
      airportPickup: {
        title: 'Airport After Hour Pickup',
        description: 'Take advantage of our convenient airport after hours pickup available at Perth Airport. Save time and skip the lines by arranging for your rental vehicle to be waiting for you upon arrival.',
        image: '/img/our_service_4.png'
      },
      additionalServices: {
        title: 'Additional Services',
        description: 'Ensure the safety and comfort of your little ones with our child seat rental options. Never get lost with our optional GPS navigation systems, available for rent with your vehicle. Stay protected on the road with our comprehensive insurance options tailored to your needs.',
        image: '/img/our_service_5.png',
        services: [
          { name: 'Child seat rentals', enabled: true, order: 1 },
          { name: 'GPS navigation systems', enabled: true, order: 2 },
          { name: 'Insurance coverage', enabled: true, order: 3 }
        ]
      },
      corporate: {
        title: 'Corporate and Business Rentals',
        description: 'We offer special corporate and business rental packages tailored to the unique requirements of your company. Streamline your business travel arrangements with our convenient booking process and dedicated account management services.',
        image: '/img/our_service_6.png'
      },
      localArea: {
        title: 'Local Area Expertise',
        description: 'Our team has extensive knowledge of the Perth area and can provide recommendations for attractions, dining options, and other points of interest. Ask us for insider tips to make the most of your stay in Western Australia.',
        image: '/img/our_service_7.png'
      },
      customerSupport: {
        title: 'Customer Support',
        description: 'Our friendly and knowledgeable customer support team is available to assist you with any questions or concerns before, during, and after your rental period. Contact us via phone, email, or visit our office for personalized assistance.',
        image: '/img/our_service_8.png'
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
    blog: {
      id: 4,
      lastModified: '2024-01-08T16:45:00Z',
      isActive: true,
      hero: {
        title: 'TRAVEL BLOG',
        subtitle: 'Discover Perth & Western Australia',
        description: 'Expert travel guides, car rental tips, and local insights to make your journey through Western Australia unforgettable.'
      },
      settings: {
        postsPerPage: 6,
        enableComments: true,
        enableSocialSharing: true,
        enableSearch: true
      },
      seoSettings: {
        title: 'Perth Travel Blog | Car Rental Tips & Western Australia Guides',
        description: 'Discover Perth with TAK8\'s travel blog. Get expert car rental tips, local guides, and insider knowledge for your Western Australia adventure.',
        keywords: 'Perth travel blog, Western Australia guides, car rental tips',
        ogTitle: 'Perth Travel Blog – TAK8',
        ogDescription: 'Your guide to exploring Perth and Western Australia with expert travel tips and car rental advice.',
        ogImage: '/img/blog_hero.png'
      }
    },
    contact: {
      id: 5,
      lastModified: '2024-01-05T11:20:00Z',
      isActive: true,
      hero: {
        title: 'CONTACT US',
        backgroundImage: '/img/contact_banner.png'
      },
      getInTouch: {
        title: 'GET IN TOUCH',
        description: 'For customized rental solutions, please email us or give us a call – we\'re happy to assist you!',
        phone: '+61 893 415 334',
        email: 'info@tak8.com.au',
        address: '17 Regal Place East Perth',
        hours: 'Mon - Fri: 9:00 AM - 5:00 PM',
        facebookUrl: 'https://facebook.com/tak8rental',
        instagramUrl: 'https://instagram.com/tak8rental'
      },
      contactForm: {
        enabled: true,
        submitButtonText: 'Send Message',
        successMessage: 'Thank you for your message! We\'ll get back to you soon.',
        errorMessage: 'Sorry, there was an error sending your message. Please try again.'
      },
      officeHours: {
        title: 'Office Hours',
        hours: 'Mon - Fri: 9:00 AM - 5:00 PM'
      },
      support: {
        title: 'Support',
        privacyPolicyText: 'Privacy Policy',
        privacyPolicyLink: '/privacy',
        termsConditionsText: 'Terms & Condition',
        termsConditionsLink: '/terms'
      },
      headOffice: {
        title: 'Head Office',
        address: '17 Regal Place East Perth',
        contactTitle: 'Contact Us',
        phone: '+61 893 415 334',
        email: 'info@tak8.com.au'
      },
      seoSettings: {
        title: 'Contact TAK8 Perth Car Rental | Get in Touch',
        description: 'Contact TAK8 for your Perth car rental needs. Located in East Perth with flexible hours and friendly service.',
        keywords: 'contact TAK8, Perth car rental contact, East Perth',
        ogTitle: 'Contact TAK8 – Perth Car Rental',
        ogDescription: 'Get in touch with TAK8 for all your Perth car rental needs. Professional service and competitive rates.',
        ogImage: '/img/contact_banner.png'
      }
    }
  });

  const tabs = [
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'aboutUs', label: 'About Us', icon: Info },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'contact', label: 'Contact', icon: MessageSquare },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleSectionUpdate = (section, data) => {
    setCmsData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [section]: data,
        lastModified: new Date().toISOString()
      }
    }));
  };

  const HomepageEditor = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Homepage Content</h2>
          <p className="text-gray-600">Manage your homepage sections and content</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Eye className="h-5 w-5 mr-2" />
            Preview
          </button>
          <button className="btn-primary">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Form</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
            <input
              type="text"
              value={cmsData.homepage.bookingForm.title}
              onChange={(e) => handleSectionUpdate('bookingForm', {
                ...cmsData.homepage.bookingForm,
                title: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={cmsData.homepage.bookingForm.enabled ? 'enabled' : 'disabled'}
              onChange={(e) => handleSectionUpdate('bookingForm', {
                ...cmsData.homepage.bookingForm,
                enabled: e.target.value === 'enabled'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Locations</label>
            <div className="space-y-2">
              {cmsData.homepage.bookingForm.pickupLocations.map((location, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      const newLocations = [...cmsData.homepage.bookingForm.pickupLocations];
                      newLocations[index] = e.target.value;
                      handleSectionUpdate('bookingForm', {
                        ...cmsData.homepage.bookingForm,
                        pickupLocations: newLocations
                      });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const newLocations = cmsData.homepage.bookingForm.pickupLocations.filter((_, i) => i !== index);
                      handleSectionUpdate('bookingForm', {
                        ...cmsData.homepage.bookingForm,
                        pickupLocations: newLocations
                      });
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  handleSectionUpdate('bookingForm', {
                    ...cmsData.homepage.bookingForm,
                    pickupLocations: [...cmsData.homepage.bookingForm.pickupLocations, 'New Location']
                  });
                }}
                className="btn-secondary text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
            <input
              type="text"
              value={cmsData.homepage.heroSection.title}
              onChange={(e) => handleSectionUpdate('heroSection', {
                ...cmsData.homepage.heroSection,
                title: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={cmsData.homepage.heroSection.subtitle}
              onChange={(e) => handleSectionUpdate('heroSection', {
                ...cmsData.homepage.heroSection,
                subtitle: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={cmsData.homepage.heroSection.description}
              onChange={(e) => handleSectionUpdate('heroSection', {
                ...cmsData.homepage.heroSection,
                description: e.target.value
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
            <input
              type="text"
              value={cmsData.homepage.heroSection.primaryButtonText}
              onChange={(e) => handleSectionUpdate('heroSection', {
                ...cmsData.homepage.heroSection,
                primaryButtonText: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
            <input
              type="text"
              value={cmsData.homepage.heroSection.secondaryButtonText}
              onChange={(e) => handleSectionUpdate('heroSection', {
                ...cmsData.homepage.heroSection,
                secondaryButtonText: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUpload
              label="Hero Background Image"
              currentImage={cmsData.homepage.heroSection.backgroundImage}
              onImageSelect={(imageData) => {
                if (imageData) {
                  handleSectionUpdate('heroSection', {
                    ...cmsData.homepage.heroSection,
                    backgroundImage: imageData.url
                  });
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Section</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={cmsData.homepage.servicesSection.title}
                onChange={(e) => handleSectionUpdate('servicesSection', {
                  ...cmsData.homepage.servicesSection,
                  title: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={cmsData.homepage.servicesSection.enabled ? 'enabled' : 'disabled'}
                onChange={(e) => handleSectionUpdate('servicesSection', {
                  ...cmsData.homepage.servicesSection,
                  enabled: e.target.value === 'enabled'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
            <div className="space-y-4">
              {cmsData.homepage.servicesSection.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => {
                          const newServices = [...cmsData.homepage.servicesSection.services];
                          newServices[index].title = e.target.value;
                          handleSectionUpdate('servicesSection', {
                            ...cmsData.homepage.servicesSection,
                            services: newServices
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={service.buttonText}
                        onChange={(e) => {
                          const newServices = [...cmsData.homepage.servicesSection.services];
                          newServices[index].buttonText = e.target.value;
                          handleSectionUpdate('servicesSection', {
                            ...cmsData.homepage.servicesSection,
                            services: newServices
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...cmsData.homepage.servicesSection.services];
                          newServices[index].description = e.target.value;
                          handleSectionUpdate('servicesSection', {
                            ...cmsData.homepage.servicesSection,
                            services: newServices
                          });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        const newServices = cmsData.homepage.servicesSection.services.filter((_, i) => i !== index);
                        handleSectionUpdate('servicesSection', {
                          ...cmsData.homepage.servicesSection,
                          services: newServices
                        });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newService = {
                    title: 'New Service',
                    description: 'Service description',
                    image: '/img/our_service_1.png',
                    buttonText: 'Read More',
                    buttonLink: '/services',
                    order: cmsData.homepage.servicesSection.services.length + 1
                  };
                  handleSectionUpdate('servicesSection', {
                    ...cmsData.homepage.servicesSection,
                    services: [...cmsData.homepage.servicesSection.services, newService]
                  });
                }}
                className="btn-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
            <input
              type="text"
              value={cmsData.homepage.seoSettings.title}
              onChange={(e) => handleSectionUpdate('seoSettings', {
                ...cmsData.homepage.seoSettings,
                title: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              value={cmsData.homepage.seoSettings.keywords}
              onChange={(e) => handleSectionUpdate('seoSettings', {
                ...cmsData.homepage.seoSettings,
                keywords: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <textarea
              value={cmsData.homepage.seoSettings.description}
              onChange={(e) => handleSectionUpdate('seoSettings', {
                ...cmsData.homepage.seoSettings,
                description: e.target.value
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'homepage':
        return <HomepageEditor />;
      case 'aboutUs':
        return <div className="text-center py-12 text-gray-500">About Us editor coming soon...</div>;
      case 'services':
        return <div className="text-center py-12 text-gray-500">Services editor coming soon...</div>;
      case 'blog':
        return <div className="text-center py-12 text-gray-500">Blog editor coming soon...</div>;
      case 'contact':
        return <div className="text-center py-12 text-gray-500">Contact editor coming soon...</div>;
      case 'media':
        return <div className="text-center py-12 text-gray-500">Media library coming soon...</div>;
      case 'testimonials':
        return <div className="text-center py-12 text-gray-500">Testimonials editor coming soon...</div>;
      case 'analytics':
        return <div className="text-center py-12 text-gray-500">Analytics coming soon...</div>;
      default:
        return <HomepageEditor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TAK8 CMS</h1>
              <p className="text-gray-600">Manage your website content</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Monitor className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded-lg ${previewMode === 'tablet' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Tablet className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Smartphone className="h-5 w-5" />
                </button>
              </div>
              <button className="btn-primary">
                <Globe className="h-5 w-5 mr-2" />
                View Live Site
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CMSManagement; 