import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  Globe, 
  Users, 
  MessageCircle, 
  Star, 
  Shield, 
  Heart,
  MapPin,
  Plane,
  Home as HomeIcon
} from 'lucide-react';
// import heroImage from '@/assets/hero-travel.jpg';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/community" replace />;
  }

  const features = [
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with travelers and hosts from over 190 countries worldwide'
    },
    {
      icon: HomeIcon,
      title: 'Safe Hosting',
      description: 'Verified hosts offering comfortable and secure accommodations'
    },
    {
      icon: MessageCircle,
      title: 'Easy Communication',
      description: 'Built-in messaging system to connect with your hosts and guests'
    },
    {
      icon: Star,
      title: 'Trusted Reviews',
      description: 'Read and write honest reviews to build community trust'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Advanced verification and safety measures for peace of mind'
    },
    {
      icon: Heart,
      title: 'Cultural Exchange',
      description: 'Share experiences and create lasting friendships across cultures'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Active Travelers' },
    { number: '50K+', label: 'Verified Hosts' },
    { number: '190+', label: 'Countries' },
    { number: '4.9', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            // src={heroImage}
            src="/assets/hero-travel.jpg"
            alt="Travel Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-primary-glow/30" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Travel. Connect.
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Belong.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto drop-shadow">
            Join a global community where every journey becomes a story, and every stranger becomes a friend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">
                <Plane className="w-5 h-5 mr-2" />
                Start Your Journey
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Users className="w-5 h-5 mr-2" />
              Explore Community
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Why Choose TravelConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the world through the eyes of locals and create connections that last a lifetime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card via-card to-secondary/10">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers and hosts creating incredible experiences together. 
            Your next adventure is just one connection away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">
                <MapPin className="w-5 h-5 mr-2" />
                Join as Traveler
              </Link>
            </Button>
            <Button variant="travel" size="xl" asChild>
              <Link to="/auth">
                <HomeIcon className="w-5 h-5 mr-2" />
                Become a Host
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
