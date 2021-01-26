import React from 'react';
import { motion } from 'framer-motion';

import ProfilePicture from './ProfilePicture';

const Title = ({ user }) => (
  <div className="pt-48 pb-28 text-center">
    {user && (
      <motion.div
        className="inline-flex items-center justify-center transform translate-y-2"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 40 }}
      >
        <div className="mr-2 h-10">
          <ProfilePicture
            user={user}
            size={40}
            bigger
          />
        </div>
        <p className="text-2xl text-gray-700">{user.name}&apos;s</p>
      </motion.div>
    )}
    <h1 className="text-6xl font-bold">peeps</h1>
  </div>
)

export default Title;
