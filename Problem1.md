# Problem 1 (Theoretical)

### Question

**A.** Given that you have only 32MB of RAM available and the average profile image size is
100KB, therefore all the images can not fit in the RAM. **What is the best way you can
think of to store these images on the hard disk drive?** (Assume that unlike RAM, hard
drive has no space limitation).

**B.** Suppose each image has the same name as the person id, i.e., if person id is 23321123
the name of the profile image will be 23321123.jpg. **What is the best way to get this
image from the hard disk?** Assume ids and image names are unique and ids are 8-digit
numbers, and the platform takes 4 byte to store the integers.


### Thoughts

**A.**

-   Since we have 32MB RAM dedicated for this purpose and average size of image is 100KB, we can safely assume that we can load maximum 320 images in the RAM.
-   Single request have no issues, we will get into problems when we take the case of concurrent requests. So writing in this respect only.

When user is uploading the image, the RAM will be used to temporarily store the image and then it will be moved to hard disk. Since we can have only 320 images at max in the RAM, so first we will funnel the request using ***queues*** so that we are allowing only 320 request at a time. Doing this will enable us to handle all the request with the existing resources. Now we will not store the image directly in the DB but we will only save the path where it is stored on the hard disk, so that whenever in future we need this image, we can easily fetch it.

**B.**
