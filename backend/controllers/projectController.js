const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects for a user
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 
      $or: [ { user: req.user._id }, { members: req.user._id } ] 
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 }); 

    res.json(projects);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ 
      name, 
      description, 
      user: req.user._id, 
      members: [], 
      tasks: [], 
      notices: [] 
    });
    res.status(201).json(project);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Get project by ID (With Full Member Details)
// @route   GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('user', 'name email pic') // 🔴 User details with name
      .populate('members', 'name email pic') // 🔴 Member details with name (Dropdown fix)
      .populate('tasks.assignedTo', 'name email') // 🔴 Task assigned user name
      .populate('notices.assignedTo', 'name email');

    if (project) {
      // Check if user is admin or member
      const isAdmin = project.user._id.toString() === req.user._id.toString();
      const isMember = project.members.some(member => member._id.toString() === req.user._id.toString());

      if (!isAdmin && !isMember) {
        return res.status(403).json({ message: 'Not authorized to view this project' });
      }

      if (!isAdmin) {
        // Filter private notices for non-admins
        project.notices = project.notices.filter(notice => {
          return notice.isPrivate === false || (notice.assignedTo && notice.assignedTo._id.toString() === req.user._id.toString());
        });
      }
      res.json(project);
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Add a member to the project
// @route   POST /api/projects/:id/members
const addMember = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    email = email.trim().toLowerCase();
    
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only Admin can add members
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });
    
    // Prevent adding the admin as a member
    if (userToAdd._id.toString() === project.user.toString()) {
      return res.status(400).json({ message: 'User is already the admin' });
    }

    if (!project.members.includes(userToAdd._id)) {
      project.members.push(userToAdd._id);
      await project.save();
    }
    
    res.json({ message: 'Member added! 🤝' });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// --- TASKS FUNCTIONS (Embedded in Project) ---

// @desc    Add a task to project
// @route   POST /api/projects/:id/tasks
const addTask = async (req, res) => {
  try {
    const { title, assignedTo, dueDate, priority } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (project) {
      const newTask = { 
        title, 
        status: 'To Do', 
        assignedTo: assignedTo || null, 
        dueDate, 
        priority: priority || 'Medium' 
      };

      project.tasks.push(newTask);
      await project.save();

      // Email notification (Optional)
      /*
      if (assignedTo) {
        const assignedUser = await User.findById(assignedTo);
        if (assignedUser) {
           // sendEmail logic here
        }
      }
      */
      
      // Return updated project with populated fields
      const updatedProject = await Project.findById(req.params.id)
        .populate('user', 'name email')
        .populate('members', 'name email')
        .populate('tasks.assignedTo', 'name email');
        
      res.status(201).json(updatedProject);
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Update task status
// @route   PUT /api/projects/:id/tasks/:taskId
const updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (project) {
      const task = project.tasks.id(req.params.taskId);
      if (task) {
        task.status = status;
        await project.save();
        
        // Return updated project
        const updatedProject = await Project.findById(req.params.id)
            .populate('user', 'name email')
            .populate('members', 'name email')
            .populate('tasks.assignedTo', 'name email');

        res.json(updatedProject);
      } else { 
        res.status(404).json({ message: 'Task not found' }); 
      }
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Delete a task
// @route   DELETE /api/projects/:id/tasks/:taskId
const deleteTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (project) {
      // Only Admin or Task Creator (if stored) can delete
      // For now, let's allow Admin only
      if (project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only Admin can delete tasks' });
      }

      // Filter out the task
      project.tasks = project.tasks.filter((task) => task._id.toString() !== req.params.taskId);
      await project.save();
      
      const updatedProject = await Project.findById(req.params.id)
        .populate('user', 'name email')
        .populate('members', 'name email')
        .populate('tasks.assignedTo', 'name email');

      res.json(updatedProject);
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// --- NOTICES FUNCTIONS ---

// @desc    Add a notice
// @route   POST /api/projects/:id/notices
const addNotice = async (req, res) => {
  try {
    const { message, assignedTo, isPrivate } = req.body;
    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const project = await Project.findById(req.params.id);
    if (project) {
      project.notices.push({ 
        message, 
        assignedTo: assignedTo || null, 
        isPrivate: isPrivate === 'true' || isPrivate === true, 
        attachment 
      });
      
      await project.save();
      
      const updatedProject = await Project.findById(req.params.id)
        .populate('user', 'name email')
        .populate('members', 'name email')
        .populate('notices.assignedTo', 'name email');

      res.status(201).json(updatedProject);
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Delete a notice
// @route   DELETE /api/projects/:id/notices/:noticeId
const deleteNotice = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      if (project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only Admin can delete notices' });
      }

      project.notices = project.notices.filter((n) => n._id.toString() !== req.params.noticeId);
      await project.save();
      
      const updatedProject = await Project.findById(req.params.id)
        .populate('user', 'name email')
        .populate('members', 'name email')
        .populate('notices.assignedTo', 'name email');

      res.json(updatedProject);
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

// @desc    Delete entire project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      if (project.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only Admin can delete the workspace' });
      }

      await project.deleteOne();
      res.json({ message: 'Project deleted successfully' });
    } else { 
      res.status(404).json({ message: 'Project not found' }); 
    }
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

module.exports = { 
  getProjects, createProject, getProjectById, addMember, 
  addTask, updateTask, deleteTask, deleteProject,
  addNotice, deleteNotice 
};