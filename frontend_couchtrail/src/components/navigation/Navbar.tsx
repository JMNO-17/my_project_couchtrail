import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';

import { useAuth } from '@/components/auth/AuthContext';
import { Home, MessageCircle, Settings, LogOut, Shield, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avator';
import { AvatarImage } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-meu';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

    const account  =localStorage.getItem('user');

    const users = JSON.parse(account);

  const navItems = [
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
  ];


    const adminRoutes = [
    { name: 'Community', href: '/community', icon: Users },
  ];

    const userRoutes = [
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
  ];


  
  
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div> */}
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              CouchTrail
            </span>
          {/* </Link> */}

          

          {/* Navigation Links for non-admin users */}
          {user && user.role !== 'admin'  && (
            <div className="hidden md:flex items-center space-x-1">
           
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      {user.role == 'admin' && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Shield className="w-3 h-3 text-primary" />
                          <span className="text-xs text-primary font-medium">Admin</span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Profile Settings for non-admin users */}
                  {user.role !== 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Admin Panel only for admins */}
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};