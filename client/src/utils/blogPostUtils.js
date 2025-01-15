import axiosInstance from "../api/axiosInstance";

export const initializeFormData = (data, setters = {}) => {
    // Use fallback functions for undefined setters to prevent crashes
    const {
      setSlug = () => {},
      setStatus = () => {},
      setCategory = () => {},
      setPublishedDate = () => {},
      setSelectedLocation = () => {},
      setTags = () => {},
      setLatitude = () => {},
      setLongitude = () => {},
      setMainImage = () => {},
      setIntroTitle = () => {},
      setIntroDate = () => {},
      setOverviewTexts = () => {},
      setRouteName = () => {},
      setLength = () => {},
      setRating = () => {},
      setRappels = () => {},
      setOverviewImages = () => {},
      setGearList = () => {},
      setGearText = () => {},
      setRouteSections = () => {},
      setGalleryImages = () => {},
    } = setters;
  
    // Logic to initialize form data remains unchanged
    setSlug(data.metadata.slug || "");
    setStatus(data.metadata.status || "draft");
    setCategory(data.metadata.category || "canyoneering");
    setPublishedDate(
      data.metadata.publishedDate
        ? new Date(data.metadata.publishedDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    );
    setSelectedLocation(data.metadata.location || "");
    setTags(data.metadata.tags || []);
    setLatitude(data.metadata.coordinates?.lat || "");
    setLongitude(data.metadata.coordinates?.lng || "");
  
    setMainImage(data.sections[0]?.intro?.imageUrl || "");
    setIntroTitle(data.sections[0]?.intro?.title || "");
    setIntroDate(
      data.sections[0]?.intro?.date
        ? new Date(data.sections[0]?.intro?.date).toISOString().split("T")[0]
        : ""
    );
  
    setOverviewTexts(
      data.sections[0]?.overview?.content?.map((c) => c.content) || [""]
    );
    setRouteName(data.sections[0]?.overview?.routeName || "");
    setLength(data.sections[0]?.overview?.length || "");
    setRating(data.sections[0]?.overview?.rating || "");
    setRappels(data.sections[0]?.overview?.rappels || "");
    setOverviewImages(
      data.sections[0]?.overview?.images?.map((img) => img.url) || []
    );
  
    setGearList(data.sections[0]?.gear?.items || [{ item: "", description: "" }]);
    setGearText(data.sections[0]?.gear?.content?.[0]?.content || "");
  
    setRouteSections(
      data.sections[0]?.route?.sections.map((section) => ({
        title: section.title,
        content: section.content.map((c) => c.content),
      })) || [
        { title: "Approach", content: [""] },
        { title: "Canyon", content: [""] },
        { title: "Exit", content: [""] },
      ]
    );
  
    setGalleryImages(
      data.sections[0]?.photos?.gallery?.map((photo) => photo.url) || []
    );
  };

export const handleSubmit = async ({
    event,
    state,
    notify,
    navigate,
    isEdit,
    id,
}) => {
    event.preventDefault();

    const {
        status,
        tags,
        publishedDate,
        category,
        selectedLocation,
        slug,
        latitude,
        longitude,
        mainImage,
        introTitle,
        introDate,
        overviewTexts,
        routeName,
        length,
        rating,
        rappels,
        overviewImages,
        gearText,
        gearList,
        routeSections,
        galleryImages,
      } = state;

      const formData = {
        metadata: {
          status,
          tags,
          publishedDate,
          category,
          location: selectedLocation,
          slug,
          coordinates: {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          },
        },
        sections: [
          {
            intro: {
              title: introTitle,
              imageUrl: mainImage,
              date: introDate,
            },
            overview: {
              routeName,
              length,
              rating,
              rappels,
              images: overviewImages.map((url) => ({ url })),
              content: overviewTexts.map((text) => ({ content: text })),
            },
            gear: {
              content: [{ content: gearText }],
              items: gearList,
            },
            route: {
              sections: routeSections.map((section) => ({
                title: section.title,
                content: section.content.map((text) => ({ content: text })),
              })),
            },
            photos: {
              gallery: galleryImages.map((url) => ({ url })),
            },
          },
        ],
      };

      try {
        if (isEdit) {
          await axiosInstance.put(`/blog-posts/edit/${id}`, formData);
          notify("success", "Blog post updated successfully!");
        } else {
          await axiosInstance.post("/blog-posts", formData);
          notify("success", "Blog post created successfully!");
        }
        navigate("/admin");
      } catch (error) {
        console.error("Error saving blog post:", error);
        notify("error", "Failed to save blog post.");
      }
  };
  