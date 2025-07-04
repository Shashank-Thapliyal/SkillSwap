
export const sanitizeData = (user) => {
  return {
    _id: user._id,
    email: user.email,
    skills: user.skills,
    profile: {
      firstName: user.profile.firstName,
      middleName: user.profile.middleName,
      lastName: user.profile.lastName,
      userName: user.profile.userName,
      profilePic: user.profile.profilePic,
      about: user.profile.about,
      location: user.profile.location,
      dob: user.profile.dob,
      gender: user.profile.gender,
    },
    connections : user.connections
  };
};
