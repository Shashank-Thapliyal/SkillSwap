import React, { useEffect, useState } from 'react';
import { OutlineButton, PrimaryButton, SecondaryButton } from "../../components/Buttons.jsx";
import { useNavigate } from 'react-router-dom';
import { getAllSkills, getAllUsers } from '../../api/feedApi.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import SkillCard from '../../components/SkillCard.jsx';
import UserCard from '../../components/UserCard.jsx';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDiscoverTab,
  setSelectedSkillToLearn
} from "../../../store/uiSlice.js"

const Discover = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState([]);
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const activeTab = useSelector(state => state.ui.discoverTab);
  const selectedSkillToLearn = useSelector(state => state.ui.selectedSkillToLearn);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const skillRes = await getAllSkills();
        const usersRes = await getAllUsers();
        if (skillRes.status === 200) {
          setSkills(skillRes.data?.skills || []);
        }

        if (usersRes.status === 200) {
          setFeaturedUsers(usersRes.data?.users || []);
        }

      } catch (error) {
        console.log("API Error:", error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const skillCategories = [
    'all', 'Technology', 'Music', 'Sports', 'Education', 'Language', 'Lifestyle', 'Art', 'Misc'
  ];

  const filteredSkills = skills.filter(skill => {
    const normalizedCategory = selectedCategory.toLowerCase() === 'misc' ? 'others' : selectedCategory.toLowerCase();
    const matchesCategory = normalizedCategory === 'all' || skill.category?.toLowerCase() === normalizedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  if (loading)
    return <Loader />

  return (
    <div className="min-h-screen bg-[#1E1E2F]">

      {/* Page Header */}
      <section className="py-12 px-6 bg-[#252538]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover <span className="text-[#00C3FF]">New Skills</span>
          </h1>
          <p className="text-xl text-[#A0A0B0] mb-8">
            Explore thousands of skills and connect with amazing teachers worldwide
          </p>

          <div className="max-w-2xl">
            <input
              type="text"
              placeholder="Search for skills, topics, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#1E1E2F] border border-[#3C3C55] rounded-lg text-white placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-8 border-b border-[#3C3C55]">
            <button
              onClick={() => {
                dispatch(setSelectedSkillToLearn(null));
                dispatch(setDiscoverTab('skills'));
              }}
              className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'skills'
                ? 'text-[#00C3FF] border-b-2 border-[#00C3FF]'
                : 'text-[#A0A0B0] hover:text-white'
                }`}
            >
              Browse Skills
            </button>
            <button
              onClick={() => {
                dispatch(setSelectedSkillToLearn(null));
                dispatch(setDiscoverTab('people'));
                console.log("hello")
              }}
              className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'people'
                ? 'text-[#00C3FF] border-b-2 border-[#00C3FF]'
                : 'text-[#A0A0B0] hover:text-white'
                }`}
            >
              Find People
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">

          {activeTab === 'skills' && (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {skillCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${selectedCategory === category
                        ? 'bg-[#00C3FF] text-black'
                        : 'bg-[#252538] text-[#A0A0B0] hover:bg-[#2A2A40] hover:text-white'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-6">
                  {selectedCategory === 'all' ? 'Popular Skills' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Skills`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSkills.map(skill => (
                    <SkillCard key={skill._id} skill={skill}  />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'people' && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Featured Teachers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(() => {
                    const filteredUsers = featuredUsers.filter(user => {
                      if (!selectedSkillToLearn) return true;
                      return user.skills?.canTeach?.some(
                        skill => skill.name?.toLowerCase() === selectedSkillToLearn.toLowerCase()
                      );
                    });

                    if (filteredUsers.length === 0) {
                      return (
                        <div className="col-span-full text-center text-[#A0A0B0] text-lg font-medium py-12">
                        {selectedSkillToLearn === null ? (
                          <>
                            <p>No teacher available at the moment...</p>
                            <h3 className="text-lg my-4 text-white font-semibold">Recommended Actions</h3>
                            <div className="flex justify-center flex-wrap gap-4 mt-4">
                              <button
                                onClick={() => dispatch(setDiscoverTab('skills'))}
                                className="px-4 py-2 rounded-full border border-[#00C3FF]/40 text-[#00C3FF] hover:bg-[#00C3FF]/10 transition"
                              >
                                Browse Skills
                              </button>
                              <button
                                onClick={() => navigate('/connections')}
                                className="px-4 py-2 rounded-full border border-[#6C5CE7]/40 text-[#6C5CE7] hover:bg-[#6C5CE7]/10 transition"
                              >
                                See Your Connections
                              </button>
                              <button
                                onClick={() => navigate('/profile')}
                                className="px-4 py-2 rounded-full border border-[#FDCB6E]/40 text-[#FDCB6E] hover:bg-[#FDCB6E]/10 transition"
                              >
                                Update Your Skills
                              </button>
                              <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 rounded-full border border-[#FF7675]/40 text-[#FF7675] hover:bg-[#FF7675]/10 transition"
                              >
                                View Dashboard
                              </button>
                            </div>
                          </>
                        ) : (
                          <p>
                            No teacher for{" "}
                            <span className="text-white font-semibold">"{selectedSkillToLearn}"</span> at the moment...
                          </p>
                        )}
                      </div>
                      
                      );
                    }
                    return filteredUsers.map(user => (
                      <UserCard key={user._id} user={user} />
                    ));
                  })()}
                </div>
              </div>

             
            </>
          )}
        </div>
      </section>


    </div>
  );
};

export default Discover;