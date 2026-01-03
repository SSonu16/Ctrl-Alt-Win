import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      icon: Star,
      price: "₹0",
      period: "forever",
      description: "Perfect for casual travelers planning occasional trips.",
      features: [
        { text: "Up to 3 trips", included: true },
        { text: "Basic itinerary builder", included: true },
        { text: "All India destinations", included: true },
        { text: "Mobile access", included: true },
        { text: "Photo storage (100 MB)", included: true },
        { text: "Budget tracking", included: false },
        { text: "Share & collaborate", included: false },
        { text: "Offline access", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Explorer",
      icon: Zap,
      price: "₹199",
      period: "per month",
      description: "For regular travelers who want more features and flexibility.",
      features: [
        { text: "Unlimited trips", included: true },
        { text: "Advanced itinerary builder", included: true },
        { text: "All India destinations", included: true },
        { text: "Mobile access", included: true },
        { text: "Photo storage (5 GB)", included: true },
        { text: "Budget tracking", included: true },
        { text: "Share & collaborate", included: true },
        { text: "Offline access", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Wanderer",
      icon: Crown,
      price: "₹499",
      period: "per month",
      description: "For serious travelers and travel professionals.",
      features: [
        { text: "Unlimited trips", included: true },
        { text: "Advanced itinerary builder", included: true },
        { text: "All India destinations", included: true },
        { text: "Mobile access", included: true },
        { text: "Photo storage (50 GB)", included: true },
        { text: "Budget tracking", included: true },
        { text: "Share & collaborate", included: true },
        { text: "Offline access", included: true },
        { text: "Priority support", included: true },
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Both Explorer and Wanderer plans come with a 14-day free trial. No credit card required.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Absolutely! You can change your plan at any time. Changes take effect from your next billing cycle.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GlobeTrotter" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-display text-2xl font-bold text-foreground">GlobeTrotter</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </Link>
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-foreground font-medium">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="hidden sm:flex">Log In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="btn-gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent
            <span className="hero-text-gradient block">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your travel style. All plans include access to our core features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative bg-card rounded-2xl p-6 border ${
                plan.popular ? "border-primary shadow-lg shadow-primary/20" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.included ? "text-foreground" : "text-muted-foreground"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/auth?mode=signup">
                <Button
                  className={`w-full ${plan.popular ? "btn-gradient" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help you find the perfect plan for your travel needs.
          </p>
          <Button variant="outline" size="lg">
            Contact Support
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 GlobeTrotter India. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
