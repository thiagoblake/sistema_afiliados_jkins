const generateAffiliateCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };
  
  module.exports = generateAffiliateCode;
  