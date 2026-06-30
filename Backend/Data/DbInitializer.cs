using System;
using System.Linq;
using System.IO;
using Backend.Models;

namespace Backend.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            // 1. Recreate database (drop if exists and create)
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // Helper 1x1 png pixel byte array to use as dummy image data
            byte[] dummyImageBytes = new byte[] {
                0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
                0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
                0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41, 0x54, 0x78, 0xDA, 0x63, 0x60, 0x18, 0x61, 0x00,
                0x00, 0x30, 0x58, 0x00, 0x0D, 0x24, 0xB5, 0x1E, 0x3D, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
                0x44, 0xAE, 0x42, 0x60, 0x82
            };

            // 2. Seed Admin Users if empty
            if (!context.AdminUsers.Any())
            {
                context.AdminUsers.Add(new AdminUser
                {
                    Username = "admin",
                    Email = "heyob93432@noproposal.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    CreatedAt = DateTime.UtcNow
                });
                context.SaveChanges();
            }

            // 3. Seed Images if empty
            if (!context.AdminImages.Any())
            {
                byte[] e1Bytes = File.Exists("../Frontend/src/assets/e1.png") ? File.ReadAllBytes("../Frontend/src/assets/e1.png") : dummyImageBytes;
                byte[] e2Bytes = File.Exists("../Frontend/src/assets/e2.png") ? File.ReadAllBytes("../Frontend/src/assets/e2.png") : dummyImageBytes;
                byte[] e3Bytes = File.Exists("../Frontend/src/assets/e3.png") ? File.ReadAllBytes("../Frontend/src/assets/e3.png") : dummyImageBytes;
                byte[] h1Bytes = File.Exists("../Frontend/src/assets/h1.png") ? File.ReadAllBytes("../Frontend/src/assets/h1.png") : dummyImageBytes;

                string[] imageNames = { "ring_preview.png", "necklace_preview.png", "earring_preview.png", "bangle_preview.png", "anklet_preview.png", "banner1.png", "banner2.png" };
                foreach (var name in imageNames)
                {
                    context.AdminImages.Add(new AdminImage
                    {
                        Name = name,
                        ContentType = "image/png",
                        ImageData = dummyImageBytes,
                        UploadedAt = DateTime.UtcNow
                    });
                }
                
                context.AdminImages.Add(new AdminImage { Name = "e1.png", ContentType = "image/png", ImageData = e1Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "e2.png", ContentType = "image/png", ImageData = e2Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "e3.png", ContentType = "image/png", ImageData = e3Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "h1.png", ContentType = "image/png", ImageData = h1Bytes, UploadedAt = DateTime.UtcNow });

                byte[] co1Bytes = File.Exists("../Frontend/src/assets/co1.png") ? File.ReadAllBytes("../Frontend/src/assets/co1.png") : dummyImageBytes;
                byte[] co2Bytes = File.Exists("../Frontend/src/assets/co2.png") ? File.ReadAllBytes("../Frontend/src/assets/co2.png") : dummyImageBytes;
                byte[] co3Bytes = File.Exists("../Frontend/src/assets/co3.png") ? File.ReadAllBytes("../Frontend/src/assets/co3.png") : dummyImageBytes;
                byte[] co4Bytes = File.Exists("../Frontend/src/assets/co4.png") ? File.ReadAllBytes("../Frontend/src/assets/co4.png") : dummyImageBytes;
                byte[] co5Bytes = File.Exists("../Frontend/src/assets/co5.png") ? File.ReadAllBytes("../Frontend/src/assets/co5.png") : dummyImageBytes;
                byte[] co6Bytes = File.Exists("../Frontend/src/assets/co6.png") ? File.ReadAllBytes("../Frontend/src/assets/co6.png") : dummyImageBytes;

                context.AdminImages.Add(new AdminImage { Name = "co1.png", ContentType = "image/png", ImageData = co1Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "co2.png", ContentType = "image/png", ImageData = co2Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "co3.png", ContentType = "image/png", ImageData = co3Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "co4.png", ContentType = "image/png", ImageData = co4Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "co5.png", ContentType = "image/png", ImageData = co5Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "co6.png", ContentType = "image/png", ImageData = co6Bytes, UploadedAt = DateTime.UtcNow });

                byte[] ca1Bytes = File.Exists("../Frontend/src/assets/ca1.png") ? File.ReadAllBytes("../Frontend/src/assets/ca1.png") : dummyImageBytes;
                byte[] ca2Bytes = File.Exists("../Frontend/src/assets/ca2.jpg") ? File.ReadAllBytes("../Frontend/src/assets/ca2.jpg") : dummyImageBytes;
                byte[] ca3Bytes = File.Exists("../Frontend/src/assets/ca3.png") ? File.ReadAllBytes("../Frontend/src/assets/ca3.png") : dummyImageBytes;
                byte[] ca4Bytes = File.Exists("../Frontend/src/assets/ca4.png") ? File.ReadAllBytes("../Frontend/src/assets/ca4.png") : dummyImageBytes;
                byte[] ca5Bytes = File.Exists("../Frontend/src/assets/ca5.png") ? File.ReadAllBytes("../Frontend/src/assets/ca5.png") : dummyImageBytes;
                byte[] ca6Bytes = File.Exists("../Frontend/src/assets/ca6.png") ? File.ReadAllBytes("../Frontend/src/assets/ca6.png") : dummyImageBytes;
                byte[] ca7Bytes = File.Exists("../Frontend/src/assets/ca7.png") ? File.ReadAllBytes("../Frontend/src/assets/ca7.png") : dummyImageBytes;

                context.AdminImages.Add(new AdminImage { Name = "ca1.png", ContentType = "image/png", ImageData = ca1Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "ca2.jpg", ContentType = "image/jpeg", ImageData = ca2Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "ca3.png", ContentType = "image/png", ImageData = ca3Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "ca4.png", ContentType = "image/png", ImageData = ca4Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "ca5.png", ContentType = "image/png", ImageData = ca5Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "ca6.png", ContentType = "image/png", ImageData = ca6Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "ca7.png", ContentType = "image/png", ImageData = ca7Bytes, UploadedAt = DateTime.UtcNow });

                byte[] p1Bytes = File.Exists("../Frontend/src/assets/1.png") ? File.ReadAllBytes("../Frontend/src/assets/1.png") : dummyImageBytes;
                byte[] p2Bytes = File.Exists("../Frontend/src/assets/2.jpg") ? File.ReadAllBytes("../Frontend/src/assets/2.jpg") : dummyImageBytes;
                byte[] p3Bytes = File.Exists("../Frontend/src/assets/3.png") ? File.ReadAllBytes("../Frontend/src/assets/3.png") : dummyImageBytes;
                byte[] p4Bytes = File.Exists("../Frontend/src/assets/4.png") ? File.ReadAllBytes("../Frontend/src/assets/4.png") : dummyImageBytes;
                byte[] p5Bytes = File.Exists("../Frontend/src/assets/5.png") ? File.ReadAllBytes("../Frontend/src/assets/5.png") : dummyImageBytes;
                byte[] p6Bytes = File.Exists("../Frontend/src/assets/6.png") ? File.ReadAllBytes("../Frontend/src/assets/6.png") : dummyImageBytes;
                byte[] p7Bytes = File.Exists("../Frontend/src/assets/7.png") ? File.ReadAllBytes("../Frontend/src/assets/7.png") : dummyImageBytes;
                byte[] p8Bytes = File.Exists("../Frontend/src/assets/8.png") ? File.ReadAllBytes("../Frontend/src/assets/8.png") : dummyImageBytes;
                byte[] p9Bytes = File.Exists("../Frontend/src/assets/9.png") ? File.ReadAllBytes("../Frontend/src/assets/9.png") : dummyImageBytes;
                byte[] p10Bytes = File.Exists("../Frontend/src/assets/10.png") ? File.ReadAllBytes("../Frontend/src/assets/10.png") : dummyImageBytes;
                byte[] p11Bytes = File.Exists("../Frontend/src/assets/11.png") ? File.ReadAllBytes("../Frontend/src/assets/11.png") : dummyImageBytes;
                byte[] p12Bytes = File.Exists("../Frontend/src/assets/12.png") ? File.ReadAllBytes("../Frontend/src/assets/12.png") : dummyImageBytes;
                byte[] p13Bytes = File.Exists("../Frontend/src/assets/13.png") ? File.ReadAllBytes("../Frontend/src/assets/13.png") : dummyImageBytes;
                byte[] p14Bytes = File.Exists("../Frontend/src/assets/14.png") ? File.ReadAllBytes("../Frontend/src/assets/14.png") : dummyImageBytes;
                byte[] p15Bytes = File.Exists("../Frontend/src/assets/15.png") ? File.ReadAllBytes("../Frontend/src/assets/15.png") : dummyImageBytes;

                context.AdminImages.Add(new AdminImage { Name = "1.png", ContentType = "image/png", ImageData = p1Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "2.jpg", ContentType = "image/jpeg", ImageData = p2Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "3.png", ContentType = "image/png", ImageData = p3Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "4.png", ContentType = "image/png", ImageData = p4Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "5.png", ContentType = "image/png", ImageData = p5Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "6.png", ContentType = "image/png", ImageData = p6Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "7.png", ContentType = "image/png", ImageData = p7Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "8.png", ContentType = "image/png", ImageData = p8Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "9.png", ContentType = "image/png", ImageData = p9Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "10.png", ContentType = "image/png", ImageData = p10Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "11.png", ContentType = "image/png", ImageData = p11Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "12.png", ContentType = "image/png", ImageData = p12Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "13.png", ContentType = "image/png", ImageData = p13Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "14.png", ContentType = "image/png", ImageData = p14Bytes, UploadedAt = DateTime.UtcNow });
                context.AdminImages.Add(new AdminImage { Name = "15.png", ContentType = "image/png", ImageData = p15Bytes, UploadedAt = DateTime.UtcNow });

                context.SaveChanges();
            }

            // Capture seeded image IDs
            var imageIds = context.AdminImages.Select(img => img.Id).ToList();
            int ringImageId = imageIds.ElementAtOrDefault(0);
            int necklaceImageId = imageIds.ElementAtOrDefault(1);
            int earringImageId = imageIds.ElementAtOrDefault(2);
            int bangleImageId = imageIds.ElementAtOrDefault(3);
            int ankletImageId = imageIds.ElementAtOrDefault(4);
            int banner1ImageId = imageIds.ElementAtOrDefault(5);
            int banner2ImageId = imageIds.ElementAtOrDefault(6);
            int e1Id = imageIds.ElementAtOrDefault(7);
            int e2Id = imageIds.ElementAtOrDefault(8);
            int e3Id = imageIds.ElementAtOrDefault(9);
            int h1Id = imageIds.ElementAtOrDefault(10);
            int co1Id = imageIds.ElementAtOrDefault(11);
            int co2Id = imageIds.ElementAtOrDefault(12);
            int co3Id = imageIds.ElementAtOrDefault(13);
            int co4Id = imageIds.ElementAtOrDefault(14);
            int co5Id = imageIds.ElementAtOrDefault(15);
            int co6Id = imageIds.ElementAtOrDefault(16);
            int ca1Id = imageIds.ElementAtOrDefault(17);
            int ca2Id = imageIds.ElementAtOrDefault(18);
            int ca3Id = imageIds.ElementAtOrDefault(19);
            int ca4Id = imageIds.ElementAtOrDefault(20);
            int ca5Id = imageIds.ElementAtOrDefault(21);
            int ca6Id = imageIds.ElementAtOrDefault(22);
            int ca7Id = imageIds.ElementAtOrDefault(23);
            
            int p1Id = imageIds.ElementAtOrDefault(24);
            int p2Id = imageIds.ElementAtOrDefault(25);
            int p3Id = imageIds.ElementAtOrDefault(26);
            int p4Id = imageIds.ElementAtOrDefault(27);
            int p5Id = imageIds.ElementAtOrDefault(28);
            int p6Id = imageIds.ElementAtOrDefault(29);
            int p7Id = imageIds.ElementAtOrDefault(30);
            int p8Id = imageIds.ElementAtOrDefault(31);
            int p9Id = imageIds.ElementAtOrDefault(32);
            int p10Id = imageIds.ElementAtOrDefault(33);
            int p11Id = imageIds.ElementAtOrDefault(34);
            int p12Id = imageIds.ElementAtOrDefault(35);
            int p13Id = imageIds.ElementAtOrDefault(36);
            int p14Id = imageIds.ElementAtOrDefault(37);
            int p15Id = imageIds.ElementAtOrDefault(38);

            // 4. Seed Categories if empty
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category { Name = "Rings", Description = "Premium rings." },
                    new Category { Name = "Necklaces", Description = "Exquisite chokers and necklaces." },
                    new Category { Name = "Earrings", Description = "Traditional jhumkas and studs." },
                    new Category { Name = "Bangles", Description = "Traditional and meenakari bangles." },
                    new Category { Name = "Anklet", Description = "Designer anklets." },
                    new Category { Name = "Chain", Description = "Chains." },
                    new Category { Name = "Bridal Sets", Description = "Bridal jewellery sets." },
                    new Category { Name = "Traditional Jewellery", Description = "Traditional Jewellery." },
                    new Category { Name = "Party Wear Jewellery", Description = "Party Wear Jewellery." }
                );
                context.SaveChanges();
            }

            var categories = context.Categories.ToDictionary(c => c.Name, c => c.Id);

            // 5. Seed Collections if empty
            if (!context.Collections.Any())
            {
                context.Collections.AddRange(
                    new Collection { Name = "Bridal Collection", Description = "Exquisite bridal jewellery sets that make your special day unforgettable. Premium kundan", ImageId = co1Id, Badge = "Up to 25% off" },
                    new Collection { Name = "Wedding Collection", Description = "Exquisite bridal jewellery sets that make your special day unforgettable. Premium kundan", ImageId = co2Id, Badge = "Flat ₹ 500" },
                    new Collection { Name = "Traditional Collection", Description = "Exquisite bridal jewellery sets that make your special day unforgettable. Premium kundan", ImageId = co3Id, Badge = "Festival special 20% off" },
                    new Collection { Name = "Modern Collection", Description = "Exquisite bridal jewellery sets that make your special day unforgettable. Premium kundan", ImageId = co4Id, Badge = "Up to 25% off" },
                    new Collection { Name = "Party Wear Collection", Description = "Exquisite bridal jewellery sets that make your special day unforgettable. Premium kundan", ImageId = co5Id, Badge = "Up to 25% off" },
                    new Collection { Name = "Festival Collections", Description = "Exquisite bridal jewellery sets that make your special day unforgettable. Premium kundan", ImageId = co6Id, Badge = "Up to 25% off" }
                );
                context.SaveChanges();
            }

            var collections = context.Collections.ToDictionary(col => col.Name, col => col.Id);

            // 6. Seed Products if empty
            if (!context.Products.Any())
            {
                var prod1 = new Product { Name = "Heritage Gold covering Bangles Set", Price = 1600, Discount = 10, CategoryId = categories["Bangles"], CollectionId = collections["Festival Collections"], CustomBadge = "BEST SELLER", CreatedAt = DateTime.UtcNow };
                var prod2 = new Product { Name = "Stone work Necklace", Price = 2600, Discount = 30, CategoryId = categories["Necklaces"], CollectionId = collections["Bridal Collection"], CustomBadge = "BEST SELLER", CreatedAt = DateTime.UtcNow };
                var prod3 = new Product { Name = "Bridal Set", Price = 1600, Discount = 10, CategoryId = categories["Bridal Sets"], CollectionId = collections["Bridal Collection"], CustomBadge = "BEST SELLER", CreatedAt = DateTime.UtcNow };
                var prod4 = new Product { Name = "Temple Gold covering Necklace Set", Price = 6600, Discount = 10, CategoryId = categories["Traditional Jewellery"], CollectionId = collections["Traditional Collection"], CustomBadge = "", CreatedAt = DateTime.UtcNow };
                var prod5 = new Product { Name = "Celestial Earrings", Price = 400, Discount = 20, CategoryId = categories["Earrings"], CollectionId = collections["Party Wear Collection"], CustomBadge = "BEST SELLER", CreatedAt = DateTime.UtcNow };
                var prod6 = new Product { Name = "Palakka Choker", Price = 990, Discount = 20, CategoryId = categories["Necklaces"], CollectionId = collections["Traditional Collection"], CustomBadge = "BEST SELLER", CreatedAt = DateTime.UtcNow };
                var prod7 = new Product { Name = "Couple Rings", Price = 399, Discount = 0, CategoryId = categories["Rings"], CollectionId = collections["Wedding Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod8 = new Product { Name = "Anklet Set", Price = 800, Discount = 0, CategoryId = categories["Anklet"], CollectionId = collections["Festival Collections"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod9 = new Product { Name = "Elegant Crystal Pendant Chain", Price = 800, Discount = 0, CategoryId = categories["Chain"], CollectionId = collections["Party Wear Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod10 = new Product { Name = "Royal Polki Bridal Complete Set", Price = 6175, Discount = 0, CategoryId = categories["Bridal Sets"], CollectionId = collections["Bridal Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod11 = new Product { Name = "Temple Design Gold Tone Necklace", Price = 2720, Discount = 0, CategoryId = categories["Traditional Jewellery"], CollectionId = collections["Traditional Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod12 = new Product { Name = "Kundan Statement Ring Set", Price = 2720, Discount = 0, CategoryId = categories["Rings"], CollectionId = collections["Bridal Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod13 = new Product { Name = "Traditional Jhumka Earrings", Price = 1020, Discount = 0, CategoryId = categories["Earrings"], CollectionId = collections["Traditional Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod14 = new Product { Name = "Emerald Party Wear Necklace Set", Price = 1020, Discount = 0, CategoryId = categories["Party Wear Jewellery"], CollectionId = collections["Party Wear Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };
                var prod15 = new Product { Name = "Meenakari Gold Bangle Set", Price = 1800, Discount = 0, CategoryId = categories["Bangles"], CollectionId = collections["Traditional Collection"], CustomBadge = "Hot Deal", CreatedAt = DateTime.UtcNow };

                context.Products.AddRange(prod1, prod2, prod3, prod4, prod5, prod6, prod7, prod8, prod9, prod10, prod11, prod12, prod13, prod14, prod15);
                context.SaveChanges();

                // Map product images
                context.ProductImages.AddRange(
                    new ProductImage { ProductId = prod1.Id, ImageId = p1Id },
                    new ProductImage { ProductId = prod2.Id, ImageId = p2Id },
                    new ProductImage { ProductId = prod3.Id, ImageId = p3Id },
                    new ProductImage { ProductId = prod4.Id, ImageId = p4Id },
                    new ProductImage { ProductId = prod5.Id, ImageId = p5Id },
                    new ProductImage { ProductId = prod6.Id, ImageId = p6Id },
                    new ProductImage { ProductId = prod7.Id, ImageId = p7Id },
                    new ProductImage { ProductId = prod8.Id, ImageId = p8Id },
                    new ProductImage { ProductId = prod9.Id, ImageId = p9Id },
                    new ProductImage { ProductId = prod10.Id, ImageId = p10Id },
                    new ProductImage { ProductId = prod11.Id, ImageId = p11Id },
                    new ProductImage { ProductId = prod12.Id, ImageId = p12Id },
                    new ProductImage { ProductId = prod13.Id, ImageId = p13Id },
                    new ProductImage { ProductId = prod14.Id, ImageId = p14Id },
                    new ProductImage { ProductId = prod15.Id, ImageId = p15Id }
                );
                context.SaveChanges();
            }

            // 7. Seed Offers if empty
            if (!context.Offers.Any())
            {
                var offer1 = new Offer { Name = "Bridal Season Sale", DiscountPercent = 25, StartDate = DateTime.UtcNow.AddDays(-5), EndDate = DateTime.UtcNow.AddDays(30) };
                var offer2 = new Offer { Name = "Festive Diwali Offer", DiscountPercent = 15, StartDate = DateTime.UtcNow.AddDays(-2), EndDate = DateTime.UtcNow.AddDays(15) };
                var offer3 = new Offer { Name = "New Arrival Flash Discount", DiscountPercent = 10, StartDate = DateTime.UtcNow.AddDays(10), EndDate = DateTime.UtcNow.AddDays(12) }; // Future scheduled offer

                context.Offers.AddRange(offer1, offer2, offer3);
                context.SaveChanges();

                // Link applicable products to offer1 (Temple Necklace and Bangles)
                var p1 = context.Products.FirstOrDefault(p => p.Name.Contains("Temple"));
                var p2 = context.Products.FirstOrDefault(p => p.Name.Contains("Bangle"));
                if (p1 != null) context.OfferProducts.Add(new OfferProduct { OfferId = offer1.Id, ProductId = p1.Id });
                if (p2 != null) context.OfferProducts.Add(new OfferProduct { OfferId = offer1.Id, ProductId = p2.Id });

                // Link applicable products to offer2 (Solitaire Gold Ring)
                var p3 = context.Products.FirstOrDefault(p => p.Name.Contains("Solitaire"));
                if (p3 != null) context.OfferProducts.Add(new OfferProduct { OfferId = offer2.Id, ProductId = p3.Id });

                context.SaveChanges();
            }

            // 8. Seed Banners if empty
            if (!context.Banners.Any())
            {
                context.Banners.AddRange(
                    new Banner { Name = "Guarantee Imitation Jewellery|Shine Like |Royalty,|Without the Heavy Price.|Premium imitation jewellery crafted with precision — necklaces, bridal sets, bangles and earrings, designed to elevate every occasion.|6 Month Guarantee|6 Premium Polish", ImageId = h1Id, BannerType = "Homepage Banner", LinkUrl = "#collections", CreatedAt = DateTime.UtcNow },
                    new Banner { Name = "25% OFF|Bridal Season Sale", ImageId = e1Id, BannerType = "Promotional Banner", LinkUrl = "#offers", CreatedAt = DateTime.UtcNow },
                    new Banner { Name = "20% OFF|Festive Diwali Offer", ImageId = e2Id, BannerType = "Promotional Banner", LinkUrl = "#offers", CreatedAt = DateTime.UtcNow },
                    new Banner { Name = "15% OFF|Nwe Arrival Flash Sal", ImageId = e3Id, BannerType = "Promotional Banner", LinkUrl = "#offers", CreatedAt = DateTime.UtcNow }
                );
                context.SaveChanges();
            }

            // 9. Seed Inquiries if empty
            if (!context.Inquiries.Any())
            {
                context.Inquiries.AddRange(
                    new Inquiry { CustomerName = "Priya Sharma", Email = "priya@gmail.com", Phone = "+91 98111 22233", Message = "Hi, I am interested in purchasing the Temple Design Gold Tone Necklace. Can I customize the length of the chain?", CreatedAt = DateTime.UtcNow.AddHours(-3) },
                    new Inquiry { CustomerName = "Amit Patel", Email = "amit.patel@yahoo.com", Phone = "+91 98222 33344", Message = "Hello, do you offer cash on delivery inside Mumbai? Also, what is the shipping time for wedding bangles?", CreatedAt = DateTime.UtcNow.AddDays(-1) },
                    new Inquiry { CustomerName = "Ananya Roy", Email = "ananya.r@hotmail.com", Phone = "+91 98333 44455", Message = "Is the Classic Solitaire Gold Ring available in Rose Gold color plating?", CreatedAt = DateTime.UtcNow.AddDays(-2) }
                );
                context.SaveChanges();
            }

            // 10. Seed GalleryItems if empty
            if (!context.GalleryItems.Any())
            {
                context.GalleryItems.AddRange(
                    new GalleryItem { Title = "Temple Design Gold Tone Necklace", Category = "JEWELLERY", ImageId = ca1Id },
                    new GalleryItem { Title = "Anklet Set", Category = "COLLECTIONS", ImageId = ca2Id },
                    new GalleryItem { Title = "Traditional Jhumka Earrings", Category = "STORE", ImageId = ca3Id },
                    new GalleryItem { Title = "Elegant Crystal Pendant Chain", Category = "EVENTS", ImageId = ca4Id },
                    new GalleryItem { Title = "Royal Polki Bridal Complete Set", Category = "JEWELLERY", ImageId = ca5Id },
                    new GalleryItem { Title = "Temple Gold covering Necklace Set", Category = "COLLECTIONS", ImageId = ca6Id },
                    new GalleryItem { Title = "Kundan Statement Ring Set", Category = "STORE", ImageId = ca7Id }
                );
                context.SaveChanges();
            }
        }
    }
}
