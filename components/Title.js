import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Title = ({ user }) => (
  <div className="text-center">
    {user && (
      <motion.div
        className="inline-flex items-center justify-center transform translate-y-2"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 40 }}
      >
        <div className="mr-2 h-10">
          <Image
            className="rounded-full"
            src={user.profile_image_url_https}
            alt={`${user.name}'s profile picture`}
            height={40}
            width={40}
          />
        </div>
        <p className="text-2xl text-gray-700">{user.name}&apos;s</p>
      </motion.div>
    )}
    <h1 className="text-6xl font-bold">peeps</h1>
  </div>
)

export default Title;
