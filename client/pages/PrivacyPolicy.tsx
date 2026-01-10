import Layout from "@/components/Layout";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
                <p className="text-foreground/70 mt-1">Last updated: November 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                At EcoWardrobe AI, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email, password)</li>
                <li>Profile details (bio, avatar, location, phone)</li>
                <li>Wardrobe items and clothing preferences</li>
                <li>Style preferences and sustainability goals</li>
                <li>Usage data and interaction with our AI services</li>
                <li>Community posts and marketplace listings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Generate personalized outfit recommendations using AI</li>
                <li>Track your sustainability impact and achievements</li>
                <li>Enable community features and marketplace transactions</li>
                <li>Send you updates, notifications, and promotional content</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Protect against fraud and ensure platform security</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission using SSL/TLS</li>
                <li>Secure password hashing with bcrypt</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure cloud storage with MongoDB Atlas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/80">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="text-foreground/80">
              <p>
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-4 font-medium">
                Email: privacy@ecowardrobe.ai<br />
                Address: 123 Sustainable Street, Green City, EC 12345
              </p>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>
              By using EcoWardrobe AI, you agree to this Privacy Policy. We may update this policy from time to time,
              and we will notify you of any significant changes.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
